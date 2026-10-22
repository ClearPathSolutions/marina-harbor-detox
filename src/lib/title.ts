import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Site-audit limit for a rendered <title>. */
const MAX_TITLE = 70;
const SUFFIX = ` | ${site.name}`;

/**
 * Page <title> for a content doc. The root layout's template appends
 * " | Marina Harbor Detox"; when that would push the rendered title past 70
 * characters the brand is dropped for that page (an `absolute` title) so the
 * descriptive part is what survives. Titles that are over 70 on their own are
 * left as written — those need an editorial rewrite, not truncation.
 */
export function pageTitle(raw: string): Metadata["title"] {
  const base = raw.replace(/\s*[|–—-]\s*Marina Harbor Detox\s*$/i, "").trim();
  if (base.length + SUFFIX.length <= MAX_TITLE) return base;
  // Dropping the brand only helps if the result then fits; a title that is
  // over 70 by itself keeps the brand (dropping it would just make the
  // <title> identical to the <h1> on top of still being too long).
  return base.length <= MAX_TITLE ? { absolute: base } : base;
}

/** The same title as a plain string, for og:title / twitter:title. */
export function pageTitleText(raw: string): string {
  const t = pageTitle(raw);
  return typeof t === "string" ? `${t}${SUFFIX}` : (t as { absolute: string }).absolute;
}
