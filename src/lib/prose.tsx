import Link from "next/link";

/**
 * Inline internal links for archived body prose.
 *
 * WHY THIS EXISTS
 * ---------------
 * `Block` is `{ tag, text }` — plain strings. Across all 116 archived pages
 * (3,791 blocks) not one carries link data, because the WordPress extractor kept
 * text and dropped inline markup. So the entire prose body of the site — the
 * whole SEO surface — had zero inline internal links and no way to add one
 * without re-extracting the content.
 *
 * This restores the highest-value part of that: linking the service a paragraph
 * is already talking about to the page about it.
 *
 * DELIBERATELY CONSERVATIVE. Auto-linking prose goes wrong when it is greedy, so:
 *   - only the curated terms below, which all map to a real page we own;
 *   - longest phrase wins ("alcohol detox" before "detox"), so we never link a
 *     fragment of a longer term;
 *   - first occurrence of each term only, and MAX_LINKS per page in total;
 *   - never links to the page you are already on;
 *   - paragraphs only — never headings, so heading text is untouched;
 *   - whole-word matching, so "detoxification" is not linked as "detox".
 */

/** Term → the page it belongs to. Keys are matched case-insensitively. */
const TERMS: Record<string, string> = {
  "alcohol detox": "/what-we-offer/alcohol-detox",
  "alcohol withdrawal": "/what-we-offer/alcohol-detox",
  "drug detox": "/what-we-offer/drug-detox",
  "medical detox": "/what-we-offer/detox-san-francisco",
  "medically supervised detox": "/what-we-offer/detox-san-francisco",
  "residential treatment": "/what-we-offer/inpatient-rehab-san-francisco",
  "inpatient rehab": "/what-we-offer/inpatient-rehab-san-francisco",
  "residential rehab": "/what-we-offer/inpatient-rehab-san-francisco",
  "dual diagnosis": "/what-we-offer/dual-diagnosis",
  "co-occurring": "/what-we-offer/dual-diagnosis",
  "holistic therapy": "/what-we-offer/holistic-addiction-therapy",
  aftercare: "/aftercare",
  benzodiazepines: "/what-we-offer/benzodiazepines-detox",
  benzodiazepine: "/what-we-offer/benzodiazepines-detox",
  fentanyl: "/fentanyl-detox",
  heroin: "/what-we-offer/heroin-detox",
  methamphetamine: "/what-we-offer/meth-detox",
  cocaine: "/what-we-offer/cocaine-detox",
  suboxone: "/what-we-offer/suboxone-detox",
  "prescription drugs": "/what-we-offer/prescription-drugs-detox",
};

/** Past this many the copy starts reading like a link farm. */
const MAX_LINKS = 4;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Longest first so "alcohol detox" is matched before "detox" could be.
const PATTERN = new RegExp(
  `\\b(${Object.keys(TERMS)
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|")})\\b`,
  "gi",
);

export type Linker = (text: string) => React.ReactNode;

/**
 * One linker per rendered page — it carries the per-page budget and the set of
 * terms already used, so state cannot leak between pages.
 */
export function createLinker(currentPath: string): Linker {
  const usedTerms = new Set<string>();
  // Several terms point at the same page ("medical detox" and "medically
  // supervised detox" are both the detox page), so budget by DESTINATION too —
  // otherwise one page gets two links that go to the same place.
  const usedHrefs = new Set<string>();
  let count = 0;

  return (text: string) => {
    if (count >= MAX_LINKS) return text;

    const parts: React.ReactNode[] = [];
    let last = 0;
    let key = 0;

    for (const m of text.matchAll(PATTERN)) {
      if (count >= MAX_LINKS) break;
      const term = m[0].toLowerCase();
      const href = TERMS[term];
      // Unknown casing variant, already linked, already pointed at, or a self-link.
      if (!href || usedTerms.has(term) || usedHrefs.has(href) || href === currentPath) continue;

      const at = m.index ?? 0;
      if (at > last) parts.push(text.slice(last, at));
      parts.push(
        <Link
          key={key++}
          href={href}
          className="font-medium text-orange-700 underline decoration-orange-300 decoration-2 underline-offset-2 transition-colors hover:text-orange-600 hover:decoration-orange-500"
        >
          {m[0]}
        </Link>,
      );
      last = at + m[0].length;
      usedTerms.add(term);
      usedHrefs.add(href);
      count++;
    }

    if (!parts.length) return text;
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };
}
