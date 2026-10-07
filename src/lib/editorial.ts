import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";

/**
 * Editorial policy — the portfolio-wide page from the Clear Path editorial
 * policy dev package (templates/editorial-policy.html).
 *
 * The copy is shared by every site and must not be reworded here; only the five
 * merge fields below differ per site. Values mirror this site's row (SITE_ID 6,
 * Marina Harbor Detox) in the package's facilities.csv.
 *
 * GOING LIVE: fill `lastReviewed` (YYYY-MM-DD) and `contentSignoff` (a copy of
 * the CSV's CONTENT_SIGNOFF cell) below. Nothing else needs to change.
 *
 * Until every field is filled and signed off, the policy is withheld from
 * production (VERCEL_ENV === "production"): the route 404s and nothing links to
 * it, it is left out of the sitemap, and the Organization schema does not point
 * at it. Local and Vercel preview builds still render it (noindex) so it can be
 * reviewed.
 */
export const editorial = {
  /** Brand name as it appears in the site footer. */
  facilityName: site.name,
  domain: new URL(site.url).hostname,
  /**
   * Corrections inbox. EDITORIAL_EMAIL is blank in facilities.csv; this is the
   * site's public inbox (PUBLIC_EMAIL in the source-of-truth sheet), as
   * instructed for this rollout.
   */
  editorialEmail: "info@marinaharbordetox.com",
  /** Rendered as shown on the site; the tel: form comes from the same record. */
  phone: site.phones.primary.label,
  phoneTel: site.phones.primary.href.replace(/^tel:/, ""),
  /** YYYY-MM-DD. Blank in facilities.csv as of 2026-10-07. */
  lastReviewed: "",
  /** Copy of the CSV's CONTENT_SIGNOFF cell. Blank as of 2026-10-07. */
  contentSignoff: "",
} as const;

// Trailing slash: next.config.mjs sets `trailingSlash: true` (MH-35), so this
// is the form the site serves, the canonical emits and the sitemap submits.
export const EDITORIAL_POLICY_PATH = "/editorial-policy/";
export const EDITORIAL_POLICY_URL = `${site.url}${EDITORIAL_POLICY_PATH}`;
export const CORRECTIONS_ANCHOR = "content-updates-and-corrections";
export const ORGANIZATION_ID = `${site.url}/#organization`;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const editorialMissing: string[] = [
  !editorial.editorialEmail && "EDITORIAL_EMAIL",
  !ISO_DATE.test(editorial.lastReviewed) && "LAST_REVIEWED",
  !editorial.contentSignoff && "CONTENT_SIGNOFF",
].filter((f): f is string => Boolean(f));

/** Every field filled and signed off: the policy may be public. */
export const editorialPolicyReady = editorialMissing.length === 0;

/** Whether this build serves the page at all (local and previews do, for review). */
export const editorialPolicyServed =
  editorialPolicyReady || process.env.VERCEL_ENV !== "production";

/** "2026-09-30" -> "September 2026". */
function monthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * The policy body, read at build time from data/editorial-policy.html — an
 * unedited copy of the package's templates/editorial-policy.html. When the
 * master copy changes, replace that file wholesale; never hand-edit it.
 *
 * A known field that is still blank renders as a bracketed "[FIELD not set]"
 * marker in previews so it is obvious on review; once the policy is ready, any
 * blank field or unknown {{TOKEN}} fails the build (README: "Any hit blocks
 * launch").
 */
export function editorialPolicyBody(): string {
  const file = path.join(process.cwd(), "data/editorial-policy.html");
  const fields: Record<string, string> = {
    FACILITY_NAME: editorial.facilityName,
    DOMAIN: editorial.domain,
    EDITORIAL_EMAIL: editorial.editorialEmail,
    PHONE: editorial.phone,
    PHONE_TEL: editorial.phoneTel,
    LAST_REVIEWED: ISO_DATE.test(editorial.lastReviewed) ? monthYear(editorial.lastReviewed) : "",
  };

  const html = readFileSync(file, "utf8")
    // Header comment is dev notes, not page content.
    .replace(/<!--[\s\S]*?-->/g, "")
    // PageHero renders the page's single H1.
    .replace(/<h1>[\s\S]*?<\/h1>/, "")
    // The policy's About link (/about/) already matches this site's About URL,
    // so no href adjustment is needed.
    .replace(/\{\{([A-Z_]+)\}\}/g, (token, name: string) => {
      if (!(name in fields)) return token;
      if (fields[name]) return escapeHtml(fields[name]);
      return editorialPolicyReady ? token : `[${name} not set]`;
    })
    .trim();

  if (editorialPolicyReady && html.includes("{{")) {
    throw new Error(
      `Editorial policy still contains a placeholder: ${html.match(/\{\{[^}]*\}\}/)?.[0]}`,
    );
  }

  return html;
}
