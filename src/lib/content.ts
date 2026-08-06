import fs from "fs";
import path from "path";
import approvedPhotos from "../../content/approved-photos.json";
import { nav, postCategories } from "./site";

// Loads the archived WordPress content (extracted to /content) and maps it to
// routes + local images. All reads happen at build time (static generation).

export type Block = {
  tag: "h1" | "h2" | "h3" | "h4" | "p" | "li" | "blockquote";
  text: string;
};

export type Doc = {
  url: string;
  slug: string;
  type: "page" | "post";
  title: string;
  h1: string;
  metaDescription: string;
  canonical: string;
  ogImage: string;
  blocks: Block[];
  images: string[];
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function readDir(sub: string): Doc[] {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Doc);
}

export function getPages(): Doc[] {
  return readDir("pages");
}

export function getPosts(): Doc[] {
  return readDir("posts").sort((a, b) => (postDate(b.url)?.iso ?? "").localeCompare(postDate(a.url)?.iso ?? ""));
}

export function getAllDocs(): Doc[] {
  return [...getPages(), ...getPosts()];
}

/**
 * MH-33 — homepage blog cards, derived from `content/posts` at build time.
 *
 * These used to be a hardcoded `blogPosts` array in site.ts, which silently
 * drifted from /blog whenever a post was added. Everything here comes from the
 * post itself; `author` stays a site-level constant because blog authorship is
 * an open question (D-3 / MH-15) and must not be resolved by this function.
 */
export type HomepagePost = {
  title: string;
  href: string;
  date: string;
  excerpt: string;
  image: string | null;
  category: string | null;
};

export function homepagePosts(count = 3): HomepagePost[] {
  return getPosts()
    .slice(0, count)
    .map((doc) => ({
      title: doc.h1 || doc.title,
      href: "/" + pathSegments(doc.url).join("/"),
      date: postDate(doc.url)?.label ?? "",
      excerpt: excerpt(doc, 150),
      image: leadImage(doc),
      category: postCategories[doc.slug] ?? null,
    }));
}

/** Turn a full URL into route segments: ".../what-we-offer/alcohol-detox/" -> ["what-we-offer","alcohol-detox"] */
export function pathSegments(url: string): string[] {
  return url
    .replace(/https?:\/\/[^/]+/, "")
    .replace(/^\/|\/$/g, "")
    .split("/")
    .filter(Boolean);
}

export function getDocBySegments(segments: string[]): Doc | null {
  const key = segments.join("/");
  return getAllDocs().find((d) => pathSegments(d.url).join("/") === key) ?? null;
}


/**
 * ── Photography policy ─────────────────────────────────────────────────────
 *
 * Every photograph on this site comes from the client-approved shoot in
 * `public/images/photos` (catalogued in `content/approved-photos.json`): drone
 * aerials of the Marina District and the Golden Gate, plus interiors of the
 * facility itself.
 *
 * The pages' own `ogImage`/`images` fields still point at the legacy WordPress
 * uploads in `/media` — generic stock that was never approved, and which
 * included a competitor's brand in one filename. Those are deliberately ignored
 * here; `leadImage()` resolves from the approved set only.
 *
 * ONE exception: real staff headshots. The approved set is scenery and interiors
 * and contains no portraits, so a bio page would otherwise show a bedroom. These
 * are photographs of actual people and are kept.
 *
 * All three of the roster's people now have one. Ashley was the last gap — she
 * rendered as an "AH" initials tile while her colleagues had faces — and her
 * headshot came from the client's own "Staff Headshots/California/Cali NORTH"
 * set, the same folder Alicia's and Gus's came from. The portal feed returns
 * photoUrl: null for all three, so this map is the only source.
 *
 * Gus deliberately keeps the tight IMG_2660 crop rather than the higher-
 * resolution MHD-Gus Saadeh.JPG in that folder: the latter is a full-body
 * seated portrait, and in this page's 4:5 portrait frame his face would end up
 * a small fraction of the tile. Resolution is not the only thing that matters
 * in a headshot — framing is.
 *
 * The two legacy paths stay under /media (that is where they were mirrored from
 * WordPress); new headshots go in /images/staff, which is what they actually are.
 */
const HEADSHOTS: Record<string, string> = {
  about__gus_saadeh: "/media/2026/02/IMG_2660.jpg",
  about__alicia_joslin: "/media/2026/06/MHD-Alicia-Joslin.png",
  about__ashley_hurtado: "/images/staff/ashley-hurtado.jpg",
};

/**
 * The team, as one page.
 *
 * Each person used to get their own route with their headshot blown up to a
 * full-width 16:9 band — which cropped 55% off Alicia's portrait and clipped the
 * top of Gus's head. They are presented together on /about/team now, in a
 * portrait frame that fits the source photos, and the old per-person URLs
 * redirect there (see next.config.mjs).
 *
 * Content still comes from the same content/pages/about_*.json files, so editing
 * a bio is unchanged. Order is explicit — seniority, not filename.
 */
export type TeamMember = {
  slug: string;
  name: string;
  title: string;
  photo: string | null;
  bio: string[];
};

export const TEAM_SLUGS = ["about__alicia-joslin", "about__gus-saadeh", "about__ashley-hurtado"];

export function teamMembers(): TeamMember[] {
  const bySlug = new Map(getPages().map((p) => [p.slug, p]));
  return TEAM_SLUGS.flatMap((slug) => {
    const doc = bySlug.get(slug);
    if (!doc) return [];
    return [
      {
        slug: slug.replace(/^about__/, ""),
        name: doc.h1,
        title: doc.blocks.find((b) => b.tag === "h3")?.text ?? "",
        // HEADSHOTS is keyed with underscores; the doc slug uses hyphens.
        photo: HEADSHOTS[slug.replace(/-/g, "_")] ?? null,
        bio: doc.blocks.filter((b) => b.tag === "p").map((b) => b.text),
      },
    ];
  });
}

const photos = approvedPhotos as { name: string; category: string; file: string }[];
const byCategory = (...cats: string[]) =>
  photos.filter((p) => cats.includes(p.category)).map((p) => p.file);

/** Stable, order-independent hash so a given slug always gets the same photo. */
function slugHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Never use as a full-width hero: these crop badly at 16:9 / 3:2.
 *   bath-ensuite   0.67  portrait
 *   bath-marble    0.75  portrait  (fine in the facility gallery, which is square-ish)
 *   stairs-spiral  0.75  portrait
 *   lounge-panorama 4.51 ultra-wide letterbox
 */
const NOT_HERO_SAFE = new Set([
  "/images/photos/bath-ensuite.jpg",
  "/images/photos/bath-marble.jpg",
  "/images/photos/stairs-spiral.jpg",
  "/images/photos/lounge-panorama.jpg",
]);

/**
 * Explicit photo for every non-post page. Chosen per page subject rather than
 * hashed, so nothing lands somewhere absurd — a hashed pool previously put a
 * desk-and-monitor shot on "Holistic Therapy" and a bar-height kitchen counter
 * on "Alcohol Detox".
 *
 * Rules applied: topic must match; siblings never share; nothing from
 * NOT_HERO_SAFE; and no kitchen/bar imagery on alcohol pages.
 */
const PAGE_PHOTO: Record<string, string> = {
  // ── Core ────────────────────────────────────────────────────────────────
  about: "/images/photos/mural-marina-harbor.jpg",      // the hand-painted house mural
  facility: "/images/photos/lounge-01.jpg",             // the signature common room
  admission: "/images/photos/seating-art.jpg",          // the intake / waiting area
  "contact-location": "/images/photos/aerial-marina-01.jpg",
  faq: "/images/photos/lounge-group.jpg",               // chairs in a circle = conversation
  "care-providers": "/images/photos/hallway-credentials.jpg", // the wall of licences
  aftercare: "/images/photos/fireplace-detail.jpg",     // homely, ongoing
  "privacy-policy": "/images/photos/office-admin.jpg",  // records / admin desk
  "thank-you": "/images/photos/aerial-bridge-05.jpg",
  blog: "/images/photos/lounge-bay-view.jpg",

  // ── Bios (headshots handled separately; Ashley has none yet) ────────────
  about__ashley_hurtado: "/images/photos/sitting-room-01.jpg", // a therapy room

  // ── Who we help — private rooms, one each ───────────────────────────────
  men: "/images/photos/room-twin-01.jpg",
  women: "/images/photos/room-fireplace-05.jpg",
  "young-adults": "/images/photos/room-single-01.jpg",
  "college-students": "/images/photos/room-single-02.jpg",
  professionals: "/images/photos/room-fireplace-03.jpg", // the most private-looking suite
  "first-responders": "/images/photos/room-twin-04.jpg",

  // ── Areas we serve — a different aerial each, so no two match ───────────
  "what-we-offer/drug-rehab-marin-county": "/images/photos/aerial-bridge-01.jpg",
  "palo-alto": "/images/photos/aerial-city-01.jpg",
  "berkeley-addiction-treatment-program": "/images/photos/aerial-city-02.jpg",
  "fremont-addiction-treatment": "/images/photos/aerial-city-03.jpg",
  "san-jose": "/images/photos/aerial-city-04.jpg",
  "santa-cruz": "/images/photos/aerial-neighborhood-01.jpg",
  "santa-barbara": "/images/photos/aerial-neighborhood-02.jpg",
  "san-luis-obispo": "/images/photos/aerial-marina-02.jpg",
  "elk-grove": "/images/photos/aerial-bridge-02.jpg",

  // ── Insurance — calm interiors, one each ────────────────────────────────
  aetna: "/images/photos/lounge-03.jpg",
  cigna: "/images/photos/lounge-04.jpg",
  umr: "/images/photos/lounge-05.jpg",
  comppsych: "/images/photos/lounger-window-01.jpg",
  geisinger: "/images/photos/dining-mirror.jpg",
  "first-health-network": "/images/photos/lounge-02.jpg",

  // ── What we offer ───────────────────────────────────────────────────────
  "what-we-offer": "/images/photos/lounge-bridge-view.jpg",
  "what-we-offer/detox-san-francisco": "/images/photos/room-fireplace-04.jpg",
  "what-we-offer/inpatient-rehab-san-francisco": "/images/photos/lounge-group.jpg",
  "what-we-offer/dual-diagnosis": "/images/photos/sitting-room-01.jpg",   // 1:1 therapy
  "what-we-offer/holistic-addiction-therapy": "/images/photos/sitting-room-02.jpg", // chaise + armchair, bay view
  "what-we-offer/alcohol-detox": "/images/photos/room-fireplace-06.jpg",  // deliberately NOT the bar-stool kitchen
  "what-we-offer/drug-detox": "/images/photos/room-twin-02.jpg",
  "what-we-offer/benzodiazepines-detox": "/images/photos/room-fireplace-01.jpg",
  "what-we-offer/heroin-detox": "/images/photos/room-twin-05.jpg",
  "what-we-offer/meth-detox": "/images/photos/room-twin-03.jpg",
  "what-we-offer/cocaine-detox": "/images/photos/room-fireplace-02.jpg",
  "what-we-offer/prescription-drugs-detox": "/images/photos/room-white.jpg",
  "what-we-offer/suboxone-detox": "/images/photos/room-bay-view.jpg",
  // Deliberately shares Medical Detox's photo: same acute-detox story, and every
  // other private room is already spoken for.
  "fentanyl-detox": "/images/photos/room-fireplace-04.jpg",
};

/**
 * Topic keywords -> photo, for blog posts. First match wins, so the more
 * specific terms are listed first. Anything unmatched falls through to the
 * spread-out rotation in `poolFor`.
 */
const POST_TOPIC: [RegExp, string[]][] = [
  [/exercise|fitness|yoga|nutrition|holistic|meditation|reiki|art-therapy|music|acupuncture/, [
    "/images/photos/lounger-window-01.jpg",
    "/images/photos/lounger-window-02.jpg",
    "/images/photos/sitting-room-02.jpg",
  ]],
  [/family|codependen|relationship|loved-one|intervention/, [
    "/images/photos/dining-conference.jpg",
    "/images/photos/dining-mirror.jpg",
    "/images/photos/sitting-room-01.jpg",
  ]],
  [/group|therapy|counsel|cbt|dbt|12-step|support/, [
    "/images/photos/lounge-group.jpg",
    "/images/photos/sitting-room-01.jpg",
    "/images/photos/lounge-05.jpg",
  ]],
  [/aftercare|alumni|sober-living|long-term|relapse-prevention/, [
    "/images/photos/fireplace-detail.jpg",
    "/images/photos/sitting-room-01.jpg",
    "/images/photos/lounge-02.jpg",
  ]],
  [/insurance|cost|pay|afford/, [
    "/images/photos/office-admin.jpg",
    "/images/photos/hallway-credentials.jpg",
  ]],
  [/san-francisco|bay-area|california|northern|marin|travel/, [
    "/images/photos/aerial-bridge-03.jpg",
    "/images/photos/aerial-city-01.jpg",
    "/images/photos/aerial-neighborhood-01.jpg",
    "/images/photos/aerial-marina-02.jpg",
  ]],
  [/inpatient|residential|facility|what-to-expect|first-30|admission|amenit|meal|food|kitchen/, [
    "/images/photos/lounge-bay-view.jpg",
    "/images/photos/lounge-03.jpg",
    "/images/photos/hallway-stairs.jpg",
    "/images/photos/hallway-entry.jpg",
    "/images/photos/kitchen-02.jpg",
  ]],
  // The catch-all: this is a detox blog, so most posts land here. It needs the
  // widest rotation of the lot or every article ends up on the same photo.
  [/detox|withdrawal|timeline|taper|medication|mat|nad|addict|drug|alcohol|opioid|rehab/, [
    "/images/photos/room-fireplace-04.jpg",
    "/images/photos/room-fireplace-02.jpg",
    "/images/photos/room-fireplace-06.jpg",
    "/images/photos/room-twin-02.jpg",
    "/images/photos/room-twin-05.jpg",
    "/images/photos/room-bay-view.jpg",
    "/images/photos/lounge-04.jpg",
    "/images/photos/lounge-bridge-view.jpg",
    "/images/photos/seating-art.jpg",
    "/images/photos/aerial-bridge-06.jpg",
  ]],
];

/**
 * Fallback pool for posts with no topic keyword match — calm interiors and
 * aerials, spread by slug hash so the long tail doesn't cluster on one image.
 * Hero-unsafe crops are excluded.
 */
function fallbackPool(): string[] {
  return byCategory("lounge", "detail", "aerial").filter((f) => !NOT_HERO_SAFE.has(f));
}

/**
 * Photographs to break up a long article body.
 *
 * Across 113 article bodies the build rendered a grand total of FOUR <img> —
 * every page was an unbroken column of 43-word paragraphs with nothing for the
 * eye to rest on. These are placed between sections purely as visual relief.
 *
 * Deterministic per slug so a page always gets the same photos, and the page's
 * own hero is excluded so the same image never appears twice on one page.
 */
export function bodyPhotos(doc: Doc, count: number): string[] {
  const hero = leadImage(doc);
  // "room-fireplace-04" and "room-fireplace-02" are two frames of the same
  // suite. Excluding only the exact hero file still put a near-identical shot
  // of the same room a few paragraphs below it, which reads as a duplicate —
  // so the whole family is excluded, and no family repeats within a page.
  const family = (f: string) => f.replace(/-\d+(?=\.[a-z]+$)/i, "");
  const heroFamily = hero ? family(hero) : null;

  const pool = byCategory("lounge", "room", "detail", "aerial")
    .filter((f) => !NOT_HERO_SAFE.has(f) && family(f) !== heroFamily);
  if (!pool.length || count < 1) return [];

  // Walk the pool from a slug-stable offset, skipping any family already taken,
  // so a page gets visibly different spaces rather than three bedrooms.
  const start = slugHash(doc.slug) % pool.length;
  const out: string[] = [];
  const takenFamilies = new Set<string>();
  for (let i = 0; i < pool.length && out.length < count; i++) {
    const pick = pool[(start + i * 7) % pool.length];
    const fam = family(pick);
    if (takenFamilies.has(fam)) continue;
    takenFamilies.add(fam);
    out.push(pick);
  }
  return out;
}

/**
 * Hero / social image for a doc — always an approved photograph, chosen to suit
 * the page. Never returns null, so nothing falls back to the logo (MH-19).
 */
export function leadImage(doc: Doc): string | null {
  const key = doc.slug.replace(/-/g, "_");
  if (HEADSHOTS[key]) return HEADSHOTS[key];

  const slugPath = pathSegments(doc.url).join("/");
  if (PAGE_PHOTO[slugPath]) return PAGE_PHOTO[slugPath];
  const flat = slugPath.replace(/\//g, "__").replace(/-/g, "_");
  if (PAGE_PHOTO[flat]) return PAGE_PHOTO[flat];

  // Posts: match on subject first.
  const haystack = `${slugPath} ${doc.h1} ${doc.title}`.toLowerCase().replace(/\s+/g, "-");
  for (const [re, files] of POST_TOPIC)
    if (re.test(haystack)) return files[slugHash(doc.slug) % files.length];

  const pool = fallbackPool();
  return pool.length ? pool[slugHash(doc.slug) % pool.length] : photos[0]?.file ?? null;
}

export function postDate(url: string): { iso: string; label: string } | null {
  const m = url.match(/\/((?:19|20)\d{2})\/(\d{2})\/(\d{2})\//);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}`;
  const label = new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return { iso, label };
}

/** Short excerpt from the first substantial paragraph. */
export function excerpt(doc: Doc, max = 160): string {
  const p = doc.blocks.find((b) => b.tag === "p" && b.text.length > 40);
  if (!p) return doc.metaDescription.slice(0, max);
  return p.text.length > max ? p.text.slice(0, max).replace(/\s+\S*$/, "") + "…" : p.text;
}

/** Estimated reading time in minutes (≈200 wpm), min 1. */
export function readingTime(doc: Doc): number {
  const words = doc.blocks.reduce((n, b) => n + b.text.split(/\s+/).filter(Boolean).length, 0);
  return Math.max(1, Math.round(words / 200));
}

export type RelatedLink = { label: string; href: string };

/**
 * Curated "keep reading" links. Body copy no longer carries inline links, so we
 * rebuild internal linking from the nav groups: a page suggests its siblings,
 * a post suggests other recent posts. Falls back to the core programs.
 */
export function relatedLinks(doc: Doc, limit = 4): RelatedLink[] {
  const selfPath = "/" + pathSegments(doc.url).join("/");

  if (doc.type === "post") {
    return getPosts()
      .filter((p) => p.url !== doc.url)
      .slice(0, limit)
      .map((p) => ({ label: p.h1 || p.title, href: "/" + pathSegments(p.url).join("/") }));
  }

  const strip = (href: string) => href.split("#")[0];
  const group = nav.find((n) =>
    n.children?.some((c) => strip(c.href) === selfPath) || strip(n.href) === selfPath
  );

  const seen = new Set<string>([selfPath, "/"]);
  const out: RelatedLink[] = [];
  const push = (label: string, href: string) => {
    const h = strip(href);
    if (h.includes("#") || seen.has(h) || out.length >= limit) return;
    seen.add(h);
    out.push({ label, href });
  };

  group?.children?.forEach((c) => push(c.label, c.href));

  // Top up with core programs so every page has a full, balanced set.
  const fallback: RelatedLink[] = [
    { label: "Medical Detox", href: "/what-we-offer/detox-san-francisco" },
    { label: "Residential Inpatient", href: "/what-we-offer/inpatient-rehab-san-francisco" },
    { label: "Dual Diagnosis", href: "/what-we-offer/dual-diagnosis" },
    { label: "Verify Your Insurance", href: "/admission" },
    { label: "Tour Our Facility", href: "/facility" },
  ];
  fallback.forEach((f) => push(f.label, f.href));

  return out.slice(0, limit);
}
