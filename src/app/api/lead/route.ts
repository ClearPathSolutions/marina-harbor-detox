import { NextResponse } from "next/server";
import { site } from "@/lib/site";

// Lead intake for the insurance-verification and contact forms.
// Runs as a Vercel serverless function (the site is SSG, not static-export).
//
// Delivery is configured entirely by env vars. At least ONE must be set or the
// endpoint refuses the submission (MH-06) — silently accepting a lead we cannot
// deliver loses a person asking for treatment.
//   • LEAD_WEBHOOK_URL  — POSTs the JSON lead to any endpoint (Zapier, CRM, Slack…)
//   • RESEND_API_KEY + LEAD_TO_EMAIL + LEAD_FROM_EMAIL — emails the lead via Resend
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Rate limiting (MH-06) -------------------------------------------------
// Sliding window, keyed on client IP. In-memory, so it is per-instance and
// best-effort: a serverless fleet can admit up to LIMIT requests per warm
// instance. That is enough to stop casual scripted abuse of a healthcare intake
// form; strict global enforcement needs a shared store (Vercel KV / Upstash).
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > LIMIT;
}

type Lead = {
  intent?: "verify" | "contact";
  name?: string;
  phone?: string;
  email?: string;
  insurance?: string;
  message?: string;
  company?: string; // honeypot — real users never fill this
};

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many requests. Please call us at ${site.phones.primary.label} — we answer 24/7.`,
      },
      { status: 429, headers: { "retry-after": String(WINDOW_MS / 1000) } },
    );
  }

  let body: Lead;
  try {
    body = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Silently accept-and-drop obvious bots (honeypot filled).
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 160);
  const insurance = clean(body.insurance, 120);
  const message = clean(body.message, 4000);
  const intent = body.intent === "contact" ? "contact" : "verify";

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) errors.phone = "Please enter a valid phone number.";
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Please enter a valid email.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead = {
    intent,
    name,
    phone,
    email,
    insurance,
    message,
    receivedAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") ?? "",
  };

  const webhookConfigured = Boolean(process.env.LEAD_WEBHOOK_URL);
  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL && process.env.LEAD_FROM_EMAIL,
  );

  // MH-06: never accept-and-drop. If nothing can deliver the lead, tell the
  // visitor plainly and give them the phone number instead of a false success.
  if (!webhookConfigured && !resendConfigured) {
    console.error(
      "[lead] REFUSED — no delivery configured. Set LEAD_WEBHOOK_URL or RESEND_API_KEY+LEAD_TO_EMAIL+LEAD_FROM_EMAIL.",
      // Non-identifying shape only: which fields were present, never their values.
      JSON.stringify({
        intent,
        receivedAt: new Date().toISOString(),
        has: { name: Boolean(name), phone: Boolean(phone), email: Boolean(email), insurance: Boolean(insurance), message: Boolean(message) },
      }),
    );
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't submit your request right now. Please call us at ${site.phones.primary.label} — we answer 24/7.`,
      },
      { status: 503 },
    );
  }

  // Each configured channel is attempted independently and its outcome recorded.
  // `fetch` only rejects on a network error — a 4xx/5xx resolves normally — so the
  // status MUST be inspected, otherwise a revoked webhook or a bad RESEND_API_KEY
  // would be reported to the visitor as success and the lead lost silently. That is
  // the same accept-and-drop failure the refusal above exists to prevent.
  //
  // Success = at least one channel delivered. Failing the whole request because the
  // second channel errored would tell someone their request did not go through when
  // it did, and they would submit again or give up.
  const delivered: string[] = [];
  const failed: string[] = [];

  const attempt = async (label: string, run: () => Promise<Response>) => {
    try {
      const res = await run();
      if (res.ok) delivered.push(label);
      else failed.push(`${label} ${res.status}`);
    } catch (err) {
      failed.push(`${label} ${err instanceof Error ? err.message : "network error"}`);
    }
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    await attempt("webhook", () =>
      fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      }),
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (resendKey && to && from) {
    const subject =
      intent === "verify"
        ? `Insurance verification request — ${name}`
        : `Website contact — ${name}`;
    const lines = [
      `Intent: ${intent}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email && `Email: ${email}`,
      insurance && `Insurance: ${insurance}`,
      message && `Message: ${message}`,
      `Received: ${lead.receivedAt}`,
    ].filter(Boolean);
    await attempt("email", () =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, text: lines.join("\n"), reply_to: email || undefined }),
      }),
    );
  }

  // Failures are logged even when another channel succeeded — a webhook that has
  // been quietly 500ing for a week should be visible, not masked by the email path.
  // Only the channel and status are recorded, never the lead.
  if (failed.length) console.error("[lead] delivery channel failed", JSON.stringify(failed));

  if (!delivered.length) {
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't submit your request right now. Please call us at ${site.phones.primary.label} — we answer 24/7.`,
      },
      { status: 502 },
    );
  }

  // MH-06: the lead payload is NEVER logged. Vercel function logs are broadly
  // readable and this is identifiable health information — only a
  // non-identifying shape (which fields were present) is ever recorded.
  console.info(
    "[lead] delivered",
    JSON.stringify({
      intent,
      receivedAt: lead.receivedAt,
      via: delivered,
      has: { name: Boolean(name), phone: Boolean(phone), email: Boolean(email), insurance: Boolean(insurance), message: Boolean(message) },
    }),
  );

  return NextResponse.json({ ok: true });
}
