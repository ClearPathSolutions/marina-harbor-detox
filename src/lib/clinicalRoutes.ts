/**
 * Clinical-route classification for analytics redaction (MH-05).
 *
 * Sending a URL like `/what-we-offer/heroin-detox` to GA4, Google Ads or Meta as
 * `page_location` tells an ad platform that an identified browser is looking at
 * heroin treatment. That is the healthcare-pixel pattern behind ongoing
 * litigation, and a blanket cookie banner is not HIPAA authorization for it.
 *
 * Rule applied by `src/components/Analytics.tsx`:
 *   • Google tags  — fire, but with `page_location` replaced by REDACTED_PATH and
 *                    `page_title` replaced by REDACTED_TITLE. We keep traffic
 *                    volume; we lose the condition. That is the trade we want.
 *   • Meta Pixel   — does not fire at all. fbq reads window.location itself, so
 *                    there is no way to redact it — the only safe option is
 *                    silence on these routes.
 */

/** Generic stand-in sent instead of the real clinical path. */
export const REDACTED_PATH = "/clinical";
export const REDACTED_TITLE = "Treatment information";

/**
 * Substance and condition terms that must never appear in an outbound analytics
 * URL. Matched against the pathname, so slug wording is what counts.
 */
const SUBSTANCE = new RegExp(
  [
    "heroin", "fentanyl", "meth", "methamphetamine", "cocaine", "crack",
    "benzo", "benzodiazepine", "xanax", "ativan", "valium", "klonopin",
    "opioid", "opiate", "oxycodone", "oxycontin", "percocet", "vicodin",
    "codeine", "morphine", "suboxone", "subutex", "methadone", "naloxone",
    "narcan", "naltrexone", "alcohol", "alcoholism", "adderall", "kratom",
    "prescription-drug", "drug-detox", "dual-diagnosis", "detox", "rehab",
    "withdrawal", "addiction", "substance", "relapse", "overdose",
    "mental-health", "depression", "anxiety",
    // Condition-adjacent slugs that still reveal why someone is reading:
    "drinking", "sober", "sobriety", "triggers", "therapy", "recovery",
  ].join("|"),
  "i",
);

/** Route prefixes that are clinical by definition, whatever the slug says. */
const CLINICAL_PREFIXES = ["/what-we-offer"];

/**
 * True when the path reveals a substance, condition, or treatment programme.
 * Deliberately over-inclusive: a false positive costs one redacted pageview, a
 * false negative leaks a health inference to an ad platform.
 */
export function isClinicalRoute(pathname: string): boolean {
  const p = (pathname || "/").toLowerCase();
  if (CLINICAL_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix + "/"))) return true;
  return SUBSTANCE.test(p);
}

/** What to report to Google for a given path. */
export function analyticsPath(pathname: string): string {
  return isClinicalRoute(pathname) ? REDACTED_PATH : pathname || "/";
}
