/**
 * Shared cookie-consent state (MH-27).
 *
 * `CookieConsent` owns the banner and writes the choice; every other component
 * that loads a third party — Trustindex reviews, the Google Maps embed — reads
 * from here and subscribes, so a Decline actually suppresses the request instead
 * of merely revoking an analytics cookie after the fact.
 */

export const CONSENT_KEY = "mhd-consent";
/** Fired on the same tab when the choice changes (storage events are cross-tab only). */
export const CONSENT_EVENT = "mhd-consent-change";

export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    // Private mode / storage disabled — treat as undecided, which blocks.
    return null;
  }
}

export function writeConsent(consent: Consent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    /* ignore — the event below still updates this page */
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
}

/**
 * Subscribe to consent changes. Returns an unsubscribe function.
 * Handles both same-tab (custom event) and cross-tab (storage event) updates.
 */
export function onConsentChange(cb: (consent: Consent | null) => void): () => void {
  const onCustom = (e: Event) => cb((e as CustomEvent<Consent>).detail ?? readConsent());
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY) cb(readConsent());
  };
  window.addEventListener(CONSENT_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
