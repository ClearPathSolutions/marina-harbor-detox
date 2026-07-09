"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { ArrowRight, Check, Phone, Shield } from "./Icons";

type Intent = "verify" | "contact";
type Status = "idle" | "submitting" | "success" | "error";

const insurers = [
  "Aetna", "Cigna", "Anthem / Elevance", "Blue Cross Blue Shield", "Highmark",
  "TRICARE", "First Health Network", "UMR", "CompPsych", "Other / Not sure",
];

export default function LeadForm({ intent = "verify" }: { intent?: Intent }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isVerify = intent === "verify";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, intent }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
      } else {
        setErrors(json.errors ?? {});
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-4xl border border-navy-100 bg-white p-8 text-center shadow-card sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-white">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-navy-900">Thank you — we&rsquo;ve got it.</h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-navy-900/70">
          {isVerify
            ? "One of our admissions coordinators will contact you shortly to review your benefits — confidentially and with no obligation."
            : "A member of our team will reach out to you shortly. If it’s urgent, please call us any time."}
        </p>
        <a href={site.phones.primary.href} className="btn-orange mt-7">
          <Phone className="h-5 w-5" /> Call {site.phones.primary.label}
        </a>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? <p className="mt-1.5 text-xs font-medium text-orange-600">{errors[k]}</p> : null;

  const field =
    "w-full rounded-2xl border border-navy-200 bg-white px-4 py-3 text-navy-900 shadow-sm outline-none transition-colors placeholder:text-navy-900/35 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/30";
  const labelCls = "mb-1.5 block text-sm font-semibold text-navy-800";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="min-w-0 rounded-4xl border border-navy-100 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
        <Shield className="h-4 w-4" /> {isVerify ? "Free, confidential benefits check" : "Send us a message"}
      </div>
      <h3 className="mt-2 text-2xl font-bold text-navy-900">
        {isVerify ? "Verify your insurance" : "Get in touch"}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-navy-900/65">
        {isVerify
          ? "Most major PPO plans are accepted. Share a few details and we’ll check your coverage — no obligation."
          : "Tell us how we can help. Our team responds quickly, 24 hours a day."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lf-name" className={labelCls}>Full name</label>
          <input id="lf-name" name="name" type="text" autoComplete="name" required className={field} placeholder="Jane Doe" />
          {err("name")}
        </div>
        <div>
          <label htmlFor="lf-phone" className={labelCls}>Phone</label>
          <input id="lf-phone" name="phone" type="tel" autoComplete="tel" required className={field} placeholder="(415) 555-0123" />
          {err("phone")}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="lf-email" className={labelCls}>
          Email <span className="font-normal text-navy-900/45">(optional)</span>
        </label>
        <input id="lf-email" name="email" type="email" autoComplete="email" className={field} placeholder="you@email.com" />
        {err("email")}
      </div>

      {isVerify ? (
        <div className="mt-4">
          <label htmlFor="lf-insurance" className={labelCls}>Insurance provider</label>
          <select id="lf-insurance" name="insurance" defaultValue="" className={field}>
            <option value="" disabled>Select your provider…</option>
            {insurers.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mt-4">
          <label htmlFor="lf-message" className={labelCls}>How can we help?</label>
          <textarea id="lf-message" name="message" rows={4} className={field} placeholder="Tell us a little about your situation…" />
        </div>
      )}

      {/* Honeypot — hidden from humans, catches bots */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <button type="submit" disabled={status === "submitting"} className="btn-orange mt-6 w-full text-base disabled:opacity-70">
        {status === "submitting" ? "Sending…" : isVerify ? "Check my coverage" : "Send message"}
        {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
      </button>

      {status === "error" && !Object.keys(errors).length && (
        <p className="mt-3 text-center text-sm text-orange-600">
          Something went wrong. Please call us at{" "}
          <a href={site.phones.primary.href} className="font-semibold underline">{site.phones.primary.label}</a>.
        </p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-navy-900/50">
        Your information is kept strictly confidential and is never sold or shared. Submitting this form does not
        create a provider-patient relationship.
      </p>
    </form>
  );
}
