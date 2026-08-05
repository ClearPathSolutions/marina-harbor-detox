/**
 * Section headings are written for search, not for navigation.
 *
 * A page's h2s are full marketing sentences — "Marina Harbor Detox is a San
 * Francisco Drug and Alcohol Rehab Center for Young Adults" (85 chars). Dropped
 * verbatim into a 320px sidebar rail, 70% of them wrapped to two or three lines
 * and the jump-nav grew taller than the conversion card beside it.
 *
 * This turns a heading into a nav label: first clause only, brand prefix gone,
 * trailing location clause gone, hard-capped on a word boundary. The heading
 * itself is untouched — only the link text changes.
 */

/** One entry in a page's jump nav. */
export type TocItem = { id: string; label: string };

const CITIES = [
  "San Francisco", "Northern California", "California", "the Bay Area", "Bay Area",
  "Marin County", "Palo Alto", "Berkeley", "Fremont", "San Jose", "Santa Cruz",
  "Santa Barbara", "San Luis Obispo", "Elk Grove",
].join("|");

// "Marina Harbor Detox Provides " / "Marina Harbor Recovery Offers a " / "Marina Harbor’s "
const BRAND_PREFIX = new RegExp(
  "^(?:The\\s+)?Marina\\s+Harbor(?:\\s+Detox|\\s+Recovery)?(?:’s|'s)?\\s+" +
    "(?:Center\\s+)?" +
    "(?:\\b(?:is|are|was|can|will|offers?|provides?|delivers?|helps?|has)\\b\\s+)?" +
    "(?:\\b(?:a|an|the)\\b\\s+)?", // \b-anchored: without it this ate the "A" of "Addiction"
  "i",
);

const TRAILING_LOCATION = new RegExp(
  `\\s*(?:,\\s*)?\\b(?:in|for|to|near|serving|around)\\b\\s+(?:the\\s+)?(?:${CITIES})\\b.*$`,
  "i",
);
const TRAILING_COMMA_LOCATION = new RegExp(`\\s*,\\s*(?:${CITIES})\\b.*$`, "i");

const MAX = 34;

function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,.–—-]+$/, "") + "…";
}

/**
 * Condense one heading down to a nav label.
 *
 * `keepLocation` exists for collision handling: on a page where two sections
 * both reduce to "Heroin Detox", the location clause is usually the thing that
 * tells them apart. The brand prefix is stripped unconditionally — restoring it
 * would put "Marina Harbor Detox’s…" back in the rail, which is the exact noise
 * this function exists to remove.
 */
function condense(title: string, max: number, keepLocation = false): string {
  let t = title.trim();
  t = t.split(/\s*[:–—]\s+/)[0]; // first clause
  t = t.split(/(?<=[a-z])\.\s+/)[0]; // first sentence
  t = t.replace(BRAND_PREFIX, "");
  if (!keepLocation) {
    t = t.replace(TRAILING_LOCATION, "");
    t = t.replace(TRAILING_COMMA_LOCATION, "");
    t = t.replace(/\s+\b(Area|Center|Program)s?\s*$/i, "");
  }
  t = t.replace(/[\s,.–—-]+$/, "").trim();
  if (!t) t = title.trim();
  return clip(t, max);
}

/**
 * Nav label for a section, unique within `taken`.
 *
 * Two headings on one page can condense to the same string — both CompPsych
 * sections become "Does CompPsych Insurance Cover…", and a heroin page has both
 * "Heroin Detox" and "…Heroin Detox Center in San Francisco". On a collision the
 * location is added back before the label is allowed to grow, so the two entries
 * differ by something meaningful rather than by a "(2)" suffix.
 */
export function tocLabel(title: string, taken: Set<string>): string {
  const attempts: [number, boolean][] = [
    [MAX, false], // 34 chars, no location — the normal case
    [46, true], // keep the location: "Heroin Detox Center in San Francisco"
    [60, true],
  ];
  for (const [max, keepLocation] of attempts) {
    const label = condense(title, max, keepLocation);
    if (!taken.has(label)) {
      taken.add(label);
      return label;
    }
  }
  // Genuinely identical headings — number them so the links stay distinguishable.
  const base = condense(title, 52, true);
  let n = 2;
  let candidate = `${base} (${n})`;
  while (taken.has(candidate)) candidate = `${base} (${++n})`;
  taken.add(candidate);
  return candidate;
}
