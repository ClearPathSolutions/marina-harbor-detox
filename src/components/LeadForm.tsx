"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { ArrowRight, Check, Phone, Shield } from "./Icons";
import ProviderCombobox from "./ProviderCombobox";

type Intent = "verify" | "contact";
type Status = "idle" | "submitting" | "success" | "error";

// Fallback when the request fails before the server could return a message.
// The API returns human copy naming the phone line for 429/502/503, so this is
// only for network-level failures — see the catch in onSubmit.
const GENERIC_ERROR = `Something went wrong. Please call us at ${site.phones.primary.label}.`;

// Provided by Clarion's forms-capture.v1.js (loaded site-wide in Clarion.tsx).
// We drive it manually so we fully control preventDefault + our own success UI.
declare global {
  interface Window {
    ClarionForms?: {
      submit: (opts: { form_key?: string; data?: Record<string, unknown> }) => Promise<Response>;
      scan?: () => void;
    };
  }
}

// Clarion form keys — keep in sync with the ClarionLabs dashboard config.
const CLARION_FORM_KEY: Record<Intent, string> = {
  verify: "insurance_verification",
  contact: "contact",
};

export default function LeadForm({ intent = "verify" }: { intent?: Intent }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>("");
  const [provider, setProvider] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  // Synchronous re-entry guard: blocks a second submit instantly (e.g. a fast
  // double-click or Enter-then-click) before React can re-render the disabled
  // button. Without this, both clicks fire before `status` updates → 2 POSTs.
  const inFlight = useRef(false);

  const isVerify = intent === "verify";

  // MH-25: the success state replaces the whole form, which is silent to a
  // screen reader. Announce it and move focus into it.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  // Both forms are handled here (no native submit — that was reloading the page).
  // Every submission is synced to Clarion via window.ClarionForms.submit(); the
  // contact form additionally posts to our internal /api/lead (webhook/email).
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // already submitting — ignore duplicate
    inFlight.current = true;
    setStatus("submitting");
    setErrors({});
    setFormError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      // Honeypot — silently succeed for bots without sending anything.
      if (typeof data.company === "string" && data.company.trim()) {
        setStatus("success");
        form.reset();
        setProvider("");
        return;
      }

      // Client-side validation (we set noValidate, so enforce required fields here).
      const val = (k: string) => (typeof data[k] === "string" ? (data[k] as string).trim() : "");
      const nextErrors: Record<string, string> = {};
      const digits = val("phone").replace(/\D/g, "");
      if (digits.length < 10) nextErrors.phone = "Please enter a valid phone number.";
      const email = val("email");
      const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      if (isVerify) {
        if (val("firstName").length < 1) nextErrors.firstName = "Please enter your first name.";
        if (val("lastName").length < 1) nextErrors.lastName = "Please enter your last name.";
        if (!email || !emailOk) nextErrors.email = "Please enter a valid email.";
        if (!val("dob")) nextErrors.dob = "Date of birth is required for verification.";
        if (!val("insurance")) nextErrors.insurance = "Please enter your insurance provider.";
      } else {
        if (val("name").length < 2) nextErrors.name = "Please enter your name.";
        if (email && !emailOk) nextErrors.email = "Please enter a valid email.";
      }
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        setStatus("error");
        return;
      }

      // 1) Sync to Clarion (fire-and-forget; don't fail the UX if it hiccups).
      try {
        await window.ClarionForms?.submit({
          form_key: CLARION_FORM_KEY[intent],
          data: { ...data, intent },
        });
      } catch {
        /* Clarion capture is best-effort */
      }

      // 2) Contact form also records the lead in our own pipeline.
      if (!isVerify) {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...data, intent }),
        });
        const json = await res.json().catch(() => ({}));
        if (!(res.ok && json.ok)) {
          const fieldErrors: Record<string, string> = json.errors ?? {};
          setErrors(fieldErrors);
          // Rate limit (429), no-delivery (503) and delivery-failure (502) each
          // return human copy naming the phone line — surface it verbatim rather
          // than failing silently, otherwise the visitor sees a dead button.
          setFormError(Object.keys(fieldErrors).length ? "" : json.error || GENERIC_ERROR);
          setStatus("error");
          // MH-25: move focus to the first field that failed validation.
          const first = Object.keys(fieldErrors)[0];
          if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
          return;
        }
      }

      setStatus("success");
      form.reset();
      setProvider("");
    } catch {
      setFormError(GENERIC_ERROR);
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="rounded-4xl border border-navy-100 bg-white p-8 text-center shadow-card outline-none sm:p-10"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-white">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-navy-900">
          {isVerify ? "Thank you for submitting your insurance details." : "Thank you for contacting us."}
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-navy-900/70">
          {isVerify
            ? "We’ll begin running a verification of your insurance benefits right away. One of our admissions specialists will reach out to you shortly to review your coverage — confidentially and with no obligation."
            : "One of our admissions specialists will be reaching out to you shortly. If it’s urgent, you can call us any time."}
        </p>
        <a href={site.phones.primary.href} className="btn-orange mt-7">
          <Phone className="h-5 w-5" /> Call {site.phones.primary.label}
        </a>
      </div>
    );
  }

  // MH-25: errors are announced (role="alert") and tied to their input via
  // aria-describedby, with aria-invalid set through a11y() below.
  const err = (k: string) =>
    errors[k] ? (
      <p id={`lf-${k}-error`} role="alert" className="mt-1.5 text-xs font-medium text-orange-600">
        {errors[k]}
      </p>
    ) : null;

  const a11y = (k: string) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `lf-${k}-error` } : {};

  const field =
    "w-full rounded-2xl border border-navy-200 bg-white px-4 py-3 text-navy-900 shadow-sm outline-none transition-colors placeholder:text-navy-900/35 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30";
  const labelCls = "mb-1.5 block text-sm font-semibold text-navy-800";
  const optional = <span className="font-normal text-navy-900/45">(optional)</span>;
  const req = <span aria-hidden className="text-orange-600"> *</span>;

  // ── Insurance verification form (Clarion-captured) ──────────────────────────
  if (isVerify) {
    return (
      <form
        onSubmit={onSubmit}
        noValidate
        // Captured via window.ClarionForms.submit() in onSubmit (NOT the auto-wire
        // data-clarion-form attribute, which lets the native submit reload the page).
        className="min-w-0 rounded-4xl border border-navy-100 bg-white p-6 shadow-card sm:p-8"
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
          <Shield className="h-4 w-4" /> Verify your coverage
        </div>
        <h3 className="mt-2 text-2xl font-bold text-navy-900">Confidential insurance verification</h3>
        <p className="mt-2 text-sm leading-relaxed text-navy-900/65">
          Share a few details and our admissions team will confirm your benefits — usually within the same day.
          There is no cost and no obligation.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lf-first-name" className={labelCls}>First name{req}</label>
            <input id="lf-first-name" name="firstName" type="text" autoComplete="given-name" required className={field} placeholder="First name" />
            {err("firstName")}
          </div>
          <div>
            <label htmlFor="lf-last-name" className={labelCls}>Last name{req}</label>
            <input id="lf-last-name" name="lastName" type="text" autoComplete="family-name" required className={field} placeholder="Last name" />
            {err("lastName")}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="lf-phone" className={labelCls}>Phone{req}</label>
            <input id="lf-phone" name="phone" type="tel" autoComplete="tel" required className={field} placeholder="(000) 000-0000" />
            {err("phone")}
          </div>
          <div>
            <label htmlFor="lf-email" className={labelCls}>Email{req}</label>
            <input id="lf-email" name="email" type="email" autoComplete="email" required className={field} placeholder="you@example.com" />
            {err("email")}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="lf-dob" className={labelCls}>Date of birth{req}</label>
          <input id="lf-dob" name="dob" type="date" required autoComplete="bday" className={field} aria-describedby="lf-dob-hint" />
          <p id="lf-dob-hint" className="mt-1.5 text-xs text-navy-900/45">
            Required — insurers use your date of birth to confirm coverage.
          </p>
          {err("dob")}
        </div>

        <div className="mt-4">
          <label htmlFor="lf-insurance" className={labelCls}>Insurance provider{req}</label>
          <ProviderCombobox
            id="lf-insurance"
            name="insurance"
            required
            value={provider}
            onChange={setProvider}
            className={field}
            placeholder="Start typing, e.g. Florida Blue, Aetna, Cigna"
          />
          <p className="mt-1.5 text-xs text-navy-900/45">
            Choose from the list or type your plan if it isn&rsquo;t shown.
          </p>
          {err("insurance")}
        </div>

        <div className="mt-4">
          <label htmlFor="lf-member-id" className={labelCls}>Member / Policy ID {optional}</label>
          <input id="lf-member-id" name="memberId" type="text" autoComplete="off" className={field} placeholder="Found on the front of your insurance card" />
          {err("memberId")}
        </div>

        <div className="mt-4">
          <label htmlFor="lf-notes" className={labelCls}>Anything we should know? {optional}</label>
          <textarea id="lf-notes" name="message" rows={4} className={field} placeholder="Who is seeking treatment, timing, questions…" />
        </div>

        {/* Honeypot — hidden from humans, catches bots */}
        <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <button type="submit" disabled={status === "submitting"} className="btn-orange mt-6 text-base disabled:opacity-70">
          <Shield className="h-5 w-5" /> {status === "submitting" ? "Submitting…" : "Verify My Insurance"}
        </button>

        {status === "error" && !Object.keys(errors).length && (
          <p className="mt-3 text-sm text-orange-600">
            Something went wrong. Please call us at{" "}
            <a href={site.phones.primary.href} className="font-semibold underline">{site.phones.primary.label}</a>.
          </p>
        )}

        <p className="mt-4 text-xs leading-relaxed text-navy-900/50">
          Your information is kept strictly confidential and is never shared with third parties. This is not an
          emergency service — if you are in crisis, call or text 988. You can also reach our admissions team directly
          at{" "}
          <a href={site.phones.primary.href} className="font-semibold text-navy-900/70 underline">
            {site.phones.primary.label}
          </a>
          .
        </p>
      </form>
    );
  }

  // ── Contact form (Clarion + /api/lead) ──────────────────────────────────────
  return (
    <form onSubmit={onSubmit} noValidate className="min-w-0 rounded-4xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
        <Shield className="h-4 w-4" /> Send us a message
      </div>
      <h3 className="mt-2 text-2xl font-bold text-navy-900">Get in touch</h3>
      <p className="mt-2 text-sm leading-relaxed text-navy-900/65">
        Tell us how we can help. Our team responds quickly, 24 hours a day.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-c-name" className={labelCls}>Full name</label>
          <input id="lf-c-name" name="name" type="text" autoComplete="name" required className={field} placeholder="Jane Doe" {...a11y("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="lf-c-phone" className={labelCls}>Phone</label>
          <input id="lf-c-phone" name="phone" type="tel" autoComplete="tel" required className={field} placeholder="(415) 555-0123" {...a11y("phone")} />
          {err("phone")}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="lf-c-email" className={labelCls}>Email {optional}</label>
        <input id="lf-c-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@email.com" {...a11y("email")} />
        {err("email")}
      </div>

      <div className="mt-4">
        <label htmlFor="lf-c-message" className={labelCls}>How can we help?</label>
        <textarea id="lf-c-message" name="message" rows={4} className={field} placeholder="Tell us a little about your situation…" />
      </div>

      {/* Honeypot — hidden from humans, catches bots */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <button type="submit" disabled={status === "submitting"} className="btn-orange mt-6 w-full text-base disabled:opacity-70">
        {status === "submitting" ? "Sending…" : "Send message"}
        {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
      </button>

      {status === "error" && formError && (
        <p role="alert" className="mt-3 text-center text-sm text-orange-600">
          {formError}{" "}
          <a href={site.phones.primary.href} className="font-semibold underline">
            {site.phones.primary.label}
          </a>
        </p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-navy-900/50">
        Your information is kept strictly confidential and is never sold or shared. Submitting this form does not
        create a provider-patient relationship.
      </p>
    </form>
  );
}
