"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Consent, readConsent, writeConsent } from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function apply(consent: Consent) {
  if (typeof window === "undefined") return;
  const granted = consent === "granted";
  window.gtag?.("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
  });
  window.fbq?.("consent", granted ? "grant" : "revoke");
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      // Re-assert the saved choice on every load so tags pick it up post-consent-default.
      apply(stored);
    } else {
      setShow(true);
    }
  }, []);

  const choose = (consent: Consent) => {
    // writeConsent persists AND notifies Reviews / the Maps embed so they can
    // load (or stay blocked) immediately — see src/lib/consent.ts.
    writeConsent(consent);
    apply(consent);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      // Sits above MobileCTABar on phones (bottom-0, 65px tall) — at bottom-3 it
      // covered the Call/Text buttons while the banner was up.
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[70] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-navy-900/95 p-5 text-sm text-white/80 shadow-lift backdrop-blur-xl sm:inset-x-6 lg:bottom-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          We use cookies to analyze traffic and improve your experience. Your privacy matters — read our{" "}
          <Link href="/privacy-policy" className="font-semibold text-orange-400 underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="rounded-full border border-white/25 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="rounded-full bg-orange-500 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
