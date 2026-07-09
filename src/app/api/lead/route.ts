import { NextResponse } from "next/server";

// Lead intake for the insurance-verification and contact forms.
// Runs as a Vercel serverless function (the site is SSG, not static-export).
//
// Delivery is best-effort and configured entirely by env vars — the form works
// out of the box (returns success + logs) and becomes production-ready the moment
// one of these is set. No secrets are required to build or deploy.
//   • LEAD_WEBHOOK_URL  — POSTs the JSON lead to any endpoint (Zapier, CRM, Slack…)
//   • RESEND_API_KEY + LEAD_TO_EMAIL + LEAD_FROM_EMAIL — emails the lead via Resend
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  try {
    const webhook = process.env.LEAD_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
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
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, text: lines.join("\n"), reply_to: email || undefined }),
      });
    }

    if (!webhook && !resendKey) {
      // No delivery configured yet — keep a server-side record so nothing is lost.
      console.info("[lead] (no delivery configured)", JSON.stringify(lead));
    }
  } catch (err) {
    console.error("[lead] delivery failed", err);
    // Don't surface infra errors to the visitor — the phone line is always the fallback.
  }

  return NextResponse.json({ ok: true });
}
