import { readFileSync } from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";

/**
 * Standard legal pages, shared by every site in the portfolio (Clear Path
 * legal-pages package, 2026-10-27): privacy policy, notice of privacy
 * practices, SMS terms and terms of service.
 *
 * data/legal/*.html are unedited copies of the package's approved text. The
 * wording must not be changed here; only the merge fields below differ per
 * site. When the master copy changes, replace the file wholesale.
 *
 * The notice of privacy practices is the package's INTERIM notice (HHS model);
 * replace it with the text QHG compliance supplies when that arrives.
 */
// Trailing slash: next.config.mjs sets `trailingSlash: true` (MH-35), so this
// is the form the site serves, the canonical emits and the sitemap submits.
export const LEGAL_PATHS = {
  privacy: "/privacy-policy/",
  npp: "/notice-of-privacy-practices/",
  sms: "/sms-terms/",
  terms: "/terms-of-service/",
} as const;

/** Last revision of the legal copy. Bump by hand when the text changes. */
const LEGAL_REVISED = "October 27, 2026";

/** Terms of service effective date. Bump by hand when the terms change. */
const TOS_EFFECTIVE_DATE = "October 27, 2026";

export type LegalDoc =
  | "privacy-policy"
  | "notice-of-privacy-practices"
  | "sms-terms"
  | "terms-of-service";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fields: Record<string, string> = {
  FACILITY_NAME: escapeHtml(site.name),
  // The terms of service's ALL-CAPS paragraphs take the name upper-cased.
  FACILITY_NAME_CAPS: escapeHtml(site.name.toUpperCase()),
  DOMAIN: "marinaharbordetox.com",
  LEGAL_ENTITY_LINE: "",
  STATE_NAME: "California",
  STATE_NAME_CAPS: "CALIFORNIA",
  STREET_ADDRESS: escapeHtml(`${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`),
  PHONE: `<a href="${escapeHtml(site.phones.primary.href)}">${escapeHtml(site.phones.primary.label)}</a>`,
  PRIVACY_EMAIL: `<a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>`,
  CONTACT_EMAIL: `<a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>`,
  PP_LAST_UPDATED: LEGAL_REVISED,
  SMS_LAST_UPDATED: LEGAL_REVISED,
  NPP_EFFECTIVE_DATE: LEGAL_REVISED,
  TOS_EFFECTIVE_DATE,
};

/** The page body with merge fields filled. Server-only (reads the filesystem). */
export function legalBody(doc: LegalDoc): string {
  const html = readFileSync(path.join(process.cwd(), "data/legal", `${doc}.html`), "utf8")
    // Header comment is dev notes, not page content.
    .replace(/<!--[\s\S]*?-->/g, "")
    // The package links already use the trailing-slash form this site serves.
    .replace(/\{\{([A-Z_]+)\}\}/g, (token, name: string) => (name in fields ? fields[name] : token))
    .trim();

  if (html.includes("{{")) {
    throw new Error(`Legal page ${doc} still contains a placeholder: ${html.match(/\{\{[^}]*\}\}/)?.[0]}`);
  }
  return html;
}
