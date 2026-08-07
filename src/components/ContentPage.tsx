import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import MobileCTABar from "./MobileCTABar";
import CTASection from "./CTASection";
import FacilityGallery from "./FacilityGallery";
import LeadForm from "./LeadForm";
import ConsentMap from "./ConsentMap";
import TeamPreview from "./TeamPreview";

import PageHero from "./PageHero";
import FaqAccordion, { buildFaq } from "./FaqAccordion";
import { ArrowRight, Check, ChevronDown, Clock, MapPin, Phone, Shield } from "./Icons";
import {
  type Block,
  type Doc,
  leadImage,
  pathSegments,
  postDate,
  readingTime,
  relatedLinks,
  bodyPhotos,
} from "@/lib/content";
import { site } from "@/lib/site";
import { createLinker, type Linker } from "@/lib/prose";
import {
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
  medicalWebPageSchema,
  personSchema,
} from "@/lib/schema";

const humanize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bAnd\b/g, "&");

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Drop date/time/author artifacts that the extractor picked up as list items
const isNoise = (b: Block) => {
  if (b.tag !== "li") return false;
  const t = b.text.trim();
  return (
    /^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(t) || // "August 26, 2021"
    /^\d{1,2}:\d{2}(\s?[ap]m)?$/i.test(t) || // stray publish times: "10:42 pm"
    /CADC|LMFT|CADC II|LCSW|, MD$/.test(t) ||
    // "wpengine" is the WordPress system account, not a person. It leaked into
    // the copy as a bullet ("Written By: wpengine") — drop it rather than
    // publish it as authorship. Real authorship is D-3 / MH-15.
    /^(written\s+by\s*[:\-–—]?\s*)?wpengine$/i.test(t) ||
    t.length < 3
  );
};

/**
 * MH-13 — pull "Medically Reviewed By" / "Last Updated" out of the block stream.
 *
 * The extractor turned both into list items, so on 7 pages they render as stray
 * bullets in the middle of the copy. They are byline metadata, not content:
 * lift them out here and render them under the h1 instead.
 */
const REVIEWER_RE = /^\s*Medically\s+Reviewed\s+By\s*[:\-–—]?\s*(.+?)\s*$/i;
const UPDATED_RE = /^\s*Last\s+Updated\s*[:\-–—]?\s*(.+?)\s*$/i;

type Byline = { reviewedBy: string | null; lastUpdated: string | null };

function extractByline(blocks: Block[]): Byline & { blocks: Block[] } {
  let reviewedBy: string | null = null;
  let lastUpdated: string | null = null;

  const rest = blocks.filter((b) => {
    if (b.tag !== "li") return true;
    const r = b.text.match(REVIEWER_RE);
    if (r) {
      if (!reviewedBy) reviewedBy = r[1];
      return false;
    }
    const u = b.text.match(UPDATED_RE);
    if (u) {
      if (!lastUpdated) lastUpdated = u[1];
      return false;
    }
    return true;
  });

  return { reviewedBy, lastUpdated, blocks: rest };
}

type Section = { id: string; title: string | null; nodes: React.ReactNode[]; kinds: string[] };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "section";

/**
 * Split the flat block stream into navigable sections so long pages read as
 * discrete, scannable chunks instead of one endless column. All copy is kept —
 * nothing is hidden. Sections break at the shallowest heading present: h2 (or a
 * demoted body-h1) normally, with h3 as a fallback for pages that only use h3.
 * Consecutive <li> are still grouped into one <ul>, and an h1 that merely echoes
 * the hero headline is dropped.
 */
/**
 * MH-29 — rewrite heading tags so rendered levels never skip.
 *
 * The WordPress copy is inconsistent: some pages open with an h3 directly under
 * the hero h1 (h1→h3), others jump h2→h4. Rather than editing 23 files, we
 * normalise the stream here. A stack of source levels maps each heading to the
 * shallowest legal output level: the first body heading always becomes h2, and
 * each nested heading is at most one level deeper than its parent.
 *
 * Noise blocks and the hero echo are ignored so they cannot shift the levels.
 * Output is capped at h4, which is the deepest style ContentPage renders.
 */
/**
 * A heading is a promise that something follows. The WordPress extractor broke
 * that promise in two ways, and both render as visible defects:
 *
 *  1. Trailing headings — the source page ended with a heading whose content
 *     lived in a widget the extractor never captured (`/about` ends with
 *     "Stories of Hope in Recovery" and no testimonials). It renders as a bold
 *     line followed by the section's bottom padding: pure dead space.
 *
 *  2. Sentences marked up as headings — a 220-character Title Cased paragraph
 *     tagged `<h4>` reads as shouting, not as a heading.
 *
 * Both are fixed structurally here rather than by hand-editing content files,
 * so the next re-extraction can't reintroduce them.
 */
const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4"]);

/** Longest a real heading gets. Beyond this it is a sentence wearing a heading's tag. */
const MAX_HEADING_CHARS = 110;

function demoteSentenceHeadings(blocks: Block[]): Block[] {
  return blocks.map((b) =>
    HEADING_TAGS.has(b.tag) && b.text.trim().length > MAX_HEADING_CHARS
      ? { ...b, tag: "p" as Block["tag"] }
      : b,
  );
}

/**
 * Drop heading(s) left stranded at the very end of the stream with nothing
 * under them. Deliberately narrow: only *trailing* headings are removed, so
 * legitimate kicker/eyebrow headings that sit above another heading — "BERKELEY"
 * above the page title, "Who We Are & How We Help" above the h1 — are kept.
 */
function dropTrailingHeadings(blocks: Block[]): Block[] {
  const out = [...blocks];
  while (out.length && HEADING_TAGS.has(out[out.length - 1].tag)) out.pop();
  return out;
}

function normalizeHeadings(blocks: Block[], heroH1: string): Block[] {
  const LEVEL: Partial<Record<Block["tag"], number>> = { h1: 1, h2: 2, h3: 3, h4: 4 };
  const stack: number[] = [];

  return blocks.map((b) => {
    const src = LEVEL[b.tag];
    if (!src) return b;
    if (isNoise(b)) return b;
    // The body's echo of the hero h1 is dropped later; don't let it set a level.
    if (b.tag === "h1" && norm(b.text) === norm(heroH1)) return b;

    while (stack.length && stack[stack.length - 1] >= src) stack.pop();
    const out = Math.min(2 + stack.length, 4);
    stack.push(src);

    const tag = `h${out}` as Block["tag"];
    return tag === b.tag ? b : { ...b, tag };
  });
}

/** Insert a photo after every Nth body paragraph. */
const PARAS_PER_PHOTO = 9;

function buildSections(
  blocks: Block[],
  heroH1: string,
  linkify: Linker = (t) => t,
  photos: string[] = [],
): Section[] {
  const isHeadingH1 = (b: Block) => b.tag === "h1" && norm(b.text) !== norm(heroH1);
  const hasH2 = blocks.some((b) => b.tag === "h2" || isHeadingH1(b));
  const splitTag: Block["tag"] = hasH2 ? "h2" : "h3";
  const isBreak = (b: Block) => b.tag === splitTag || (splitTag === "h2" && isHeadingH1(b));

  const sections: Section[] = [];
  const seen = new Set<string>();
  let paraCount = 0;
  let shot = 0;
  let current: Section = { id: "", title: null, nodes: [], kinds: [] };
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    const items = [...list];
    // A run of short items is a checklist, not prose — as plain bullets it read
    // as more grey text. Long items stay a bulleted list, because a card grid of
    // 40-word sentences is worse than a list of them.
    const short = items.every((x) => x.split(/\s+/).length <= 14) && items.length >= 3;
    current.nodes.push(
      short ? (
        <ul key={`ul-${current.nodes.length}`} className="my-7 grid gap-2.5 sm:grid-cols-2">
          {items.map((t, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-xl bg-sand-50 px-4 py-3 text-[15px] leading-snug text-navy-900/80"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
              <span className="min-w-0 [overflow-wrap:anywhere]">{linkify(t)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul key={`ul-${current.nodes.length}`} className="my-6 space-y-3">
          {items.map((t, i) => (
            <li key={i} className="relative [overflow-wrap:anywhere] pl-7 leading-relaxed text-navy-900/75 before:absolute before:left-0 before:top-[0.55em] before:h-2 before:w-2 before:rounded-full before:bg-orange-500/90">
              {linkify(t)}
            </li>
          ))}
        </ul>
      )
    );
    current.kinds.push("content");
    list = [];
  };

  const commit = () => {
    flushList();
    // A titled section with no body is the same extraction artifact as a
    // trailing heading: the content lived in a WordPress widget that never made
    // it into the export. Rendering it gives a bold line floating over dead
    // space *and* a "On this page" entry that jumps to nothing. Drop it.
    // A subheading left at the end of a section has nothing under it either —
    // same broken promise as a trailing heading, just nested. Pop it.
    while (current.kinds.length && current.kinds[current.kinds.length - 1] === "heading") {
      current.nodes.pop();
      current.kinds.pop();
    }
    if (current.title !== null && current.nodes.length === 0) return;
    if (current.title !== null || current.nodes.length) sections.push(current);
  };

  const uniqueId = (text: string) => {
    const base = slugify(text);
    let id = base;
    let n = 2;
    while (seen.has(id)) id = `${base}-${n++}`;
    seen.add(id);
    return id;
  };

  const push = (node: React.ReactNode, kind = "content") => {
    current.nodes.push(node);
    current.kinds.push(kind);
  };

  blocks.forEach((b) => {
    if (isNoise(b)) return;
    if (b.tag === "li") {
      list.push(b.text);
      return;
    }
    flushList();
    if (isBreak(b)) {
      commit();
      current = { id: uniqueId(b.text), title: b.text, nodes: [], kinds: [] };
      return;
    }
    const key = current.nodes.length;
    if (b.tag === "h1" && norm(b.text) === norm(heroH1)) return; // hero echo
    if (b.tag === "h1" || b.tag === "h2")
      push(
        <h2 key={key} className="mt-10 scroll-mt-28 text-2xl font-bold text-navy-900 sm:text-3xl">
          {b.text}
        </h2>,
        "heading"
      );
    else if (b.tag === "h3")
      push(
        <h3 key={key} className="mt-9 scroll-mt-28 text-xl font-bold text-navy-900">
          {b.text}
        </h3>,
        "heading"
      );
    else if (b.tag === "h4")
      push(
        <h4 key={key} className="mt-7 scroll-mt-28 text-lg font-semibold text-navy-900">
          {b.text}
        </h4>,
        "heading"
      );
    else if (b.tag === "blockquote")
      push(
        <blockquote key={key} className="my-8 rounded-r-2xl border-l-4 border-orange-500 bg-sand-50 py-5 pl-6 pr-5 text-lg italic leading-relaxed text-navy-900/80">
          {b.text}
        </blockquote>
      );
    else {
      // The opening paragraph is the reader's way in. At the same size and
      // colour as the forty that follow, it just started the wall a line early.
      const isLead = !sections.length && current.nodes.length === 0 && !current.title;
      push(
        // mt-6 rather than mt-5: at 1.8 leading a 20px paragraph gap is on the
        // tight side, and 24px separates blocks without opening the column up.
        <p
          key={key}
          className={
            isLead
              ? "mt-2 break-words text-[19px] leading-[1.75] text-navy-900/85"
              : "mt-6 break-words leading-[1.8] text-navy-900/75"
          }
        >
          {linkify(b.text)}
        </p>
      );

      paraCount++;
      // Relief is driven by paragraph position, not section count. The heaviest
      // pages — detox-san-francisco at 34 paragraphs — are a SINGLE section
      // whose headings are inline h3s, so anything keyed to sections skipped
      // exactly the pages that most needed breaking up.
      if (paraCount % PARAS_PER_PHOTO === 0 && shot < photos.length) {
        const src = photos[shot++];
        push(
          <figure key={`fig-${key}`} className="my-10">
            <Image
              src={src}
              alt=""
              width={1600}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 928px"
              className="aspect-[16/10] w-full rounded-2xl object-cover"
            />
          </figure>,
        );
      }
    }
  });
  commit();
  return sections;
}

/** Render built sections; each titled section is a visually separated <section>. */
function Prose({ sections }: { sections: Section[] }) {
  // Number only the real, titled sections — an untitled intro block and the
  // lead-in headings that carry no copy are not chapters.
  const chapters = sections.filter((s) => s.title && s.nodes.length > 0).map((s) => s.id);
  // A lone "01" is noise, not structure — only number when there are chapters
  // to count through.
  const numbered = chapters.length >= 3 ? chapters : [];

  return (
    <>
      {sections.map((s, i) => {
        // Some archived pages carry a heading with no copy under it before the
        // next heading ("Who We Are & How We Help" on /about). Given the full
        // rule-plus-padding treatment those render as an empty boxed-off band.
        // Treat them as a lead-in to the section that follows: keep the heading,
        // drop the separator and the space it reserves for absent content.
        const empty = Boolean(s.title) && s.nodes.length === 0;
        const separated = s.title && !empty;
        const n = numbered.indexOf(s.id);

        return (
          <div key={s.id || `intro-${i}`}>
            <section
              id={s.id || undefined}
              // Spacing above a TITLED section now lives on the <h2> itself
              // (see below), so it is not also applied here — doing both stacked
              // two margins and pushed the sections ~100px apart.
              className={
                separated
                  ? "scroll-mt-28"
                  : empty
                    ? "scroll-mt-28 [&:not(:first-child)]:mt-12"
                    : "scroll-mt-28"
              }
            >
              {/* Tailwind's preflight resets every heading to `margin: 0`, so a
                  section title carried none of its own spacing — everything
                  around it came from the wrapper above and from the following
                  paragraph's own top margin. The heading now owns both sides:
                  a clear break before it, a tighter gap after it so it still
                  binds to the copy it introduces.

                  Deliberately NOT done with line-height. These titles wrap on
                  most of these pages (5 of 6 on /professionals/), and leading
                  tall enough to space the heading also forces its own two lines
                  apart — at 4.25 the box goes 72px -> 255px and one title reads
                  as two. `leading-tight` keeps a wrapped title as one block.

                  No :first-child reset here: the <h2> is ALWAYS the first child
                  of its <section>, so such a rule would zero the margin on every
                  heading, not just the first — which is exactly what happened
                  the first time round. The leading section gets the same space,
                  which reads correctly after the intro paragraph. */}
              {s.title && (
                <h2 className="mb-5 mt-16 flex items-baseline gap-3 text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
                  {n >= 0 && (
                    <span
                      aria-hidden
                      className="shrink-0 font-display text-base font-bold tabular-nums text-orange-500/70 sm:text-lg"
                    >
                      {String(n + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="min-w-0">{s.title}</span>
                </h2>
              )}
              {s.nodes}
            </section>
          </div>
        );
      })}
    </>
  );
}

function Related({ doc }: { doc: Doc }) {
  const links = relatedLinks(doc);
  if (!links.length) return null;
  const heading = doc.type === "post" ? "Keep reading" : "Explore more";
  return (
    <section className="border-t border-navy-100 bg-sand-50 section">
      <div className="container-x">
        <span className="eyebrow">{heading}</span>
        <h2 className="mt-3 text-2xl font-bold text-navy-900 sm:text-3xl">
          {doc.type === "post" ? "More from our recovery blog" : "Related programs & resources"}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-card"
            >
              <span className="font-semibold text-navy-900">{l.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-orange-500 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Names this page already lists. Staff on /about are authored as content blocks —
 * an h2 "Dedicated Team" followed by h3 name / p title pairs — so the h3 texts in
 * that run are the people already shown. Used to keep the portal grid from
 * repeating anyone.
 */
function namesOnPage(doc: Doc): string[] {
  const start = doc.blocks.findIndex(
    (b) => b.tag === "h2" && /dedicated team/i.test(b.text),
  );
  if (start === -1) return [];
  const out: string[] = [];
  for (const b of doc.blocks.slice(start + 1)) {
    if (b.tag === "h2") break; // next major section
    if (b.tag === "h3" && b.text.trim().split(/\s+/).length <= 4) {
      out.push(b.text.trim());
    }
  }
  return out;
}

export default function ContentPage({ doc }: { doc: Doc }) {
  const segs = pathSegments(doc.url);
  const slugPath = "/" + segs.join("/");
  const hero = leadImage(doc);
  const date = doc.type === "post" ? postDate(doc.url) : null;
  const rt = doc.type === "post" ? readingTime(doc) : null;
  // MH-13: lift the reviewer / last-updated bullets out before sectioning.
  const { reviewedBy, lastUpdated, blocks: bodyBlocks } = extractByline(doc.blocks);
  // One photo per ~9 body paragraphs, capped so a very long page does not turn
  // into a slideshow. Computed from the block stream because buildSections
  // needs the list up front.
  const bodyParaCount = bodyBlocks.filter((b) => b.tag === "p").length;
  // Legal pages are excluded: a luxury-interior photograph dropped into the
  // middle of a HIPAA notice reads as marketing inside a legal document.
  const isLegal = slugPath === "/privacy-policy" || slugPath === "/thank-you";
  const photos = isLegal ? [] : bodyPhotos(doc, Math.min(4, Math.floor(bodyParaCount / 9)));

  const sections = buildSections(
    normalizeHeadings(dropTrailingHeadings(demoteSentenceHeadings(bodyBlocks)), doc.h1),
    doc.h1,
    createLinker(slugPath),
    photos,
  );

  const isFacility = slugPath === "/facility";
  const isAdmission = slugPath === "/admission";
  const isContact = slugPath === "/contact-location";
  const isAbout = slugPath === "/about";
  const isFaq = slugPath === "/faq";
  const withForm = isAdmission || isContact;

  // A portrait headshot must never back the hero band: cropping a face to a
  // wide strip and running white type across it is exactly the framing problem
  // this pass exists to remove. Staff are presented on /about/team instead,
  // where the crop is portrait and the face is the subject rather than wallpaper.
  const isStaffBio = segs[0] === "about" && segs.length > 1;
  const heroPhoto = isContact || isStaffBio ? null : hero;

  const crumbs =
    doc.type === "post"
      ? [{ label: "Blog", href: "/blog" }]
      : segs.slice(0, -1).map((c, i) => ({ label: humanize(c), href: `/${segs.slice(0, i + 1).join("/")}` }));

  const mapsQuery = encodeURIComponent(
    `${site.address.street} ${site.address.city}, ${site.address.state} ${site.address.zip}`
  );

  // MH-30 — per-page structured data. Breadcrumbs are on every inner page;
  // the rest is emitted only where the page type actually warrants it.
  const isBio = slugPath.startsWith("/about/");
  const bioTitle = isBio ? doc.blocks.find((b) => b.tag === "h3")?.text ?? null : null;
  const schemas = [
    breadcrumbSchema(crumbs),
    doc.type === "post" ? blogPostingSchema(doc, slugPath, hero, reviewedBy) : null,
    doc.type !== "post" ? medicalWebPageSchema(doc, slugPath, reviewedBy) : null,
    slugPath === "/faq" ? faqSchema(doc.blocks) : null,
    isBio ? personSchema(doc, slugPath, bioTitle, hero) : null,
  ].filter(Boolean);

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <Header />
      <main id="main">
        {/* Page hero.
            The page photo lives HERE, as a banner behind the title — it used to
            sit below as a separate full-width 16:9 slab, which rendered 1336x752
            on desktop and ate ~75% of the fold on every one of 120 pages before
            a word of copy. Same photo, a third of the height, and it now does a
            job (backing the title) instead of being decoration you scroll past.
            The band itself is components/PageHero, shared with /about/team and
            /blog so all three agree on alignment, scrim and the no-photo case. */}
        <PageHero
          title={doc.h1}
          crumbs={crumbs}
          photo={heroPhoto}
          eyebrow={doc.type === "post" ? "Recovery Blog" : undefined}
          meta={
            <>
              {date && (
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold-400" /> {date.label}
                  </span>
                  <span aria-hidden className="text-white/30">·</span>
                  <span>{rt} min read</span>
                  <span aria-hidden className="text-white/30">·</span>
                  {/* Byline is contested (site.ts credits a named author, this
                      hardcodes an editorial entity) — blocked on D-3 / MH-15. */}
                  <span>Marina Harbor Detox Clinical Team</span>
                </p>
              )}

              {/* MH-13 — reviewer / last-updated byline, lifted out of the body
                  copy where the extractor had left it as stray list items. The
                  reviewer name is not yet linked: her bio page depends on D-5 /
                  MH-12. */}
              {(reviewedBy || lastUpdated) && (
                <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
                  {reviewedBy && (
                    <span className="inline-flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gold-400" />
                      Medically reviewed by <strong className="font-semibold text-white/90">{reviewedBy}</strong>
                    </span>
                  )}
                  {reviewedBy && lastUpdated && <span aria-hidden className="text-white/30">·</span>}
                  {lastUpdated && <span>Last updated {lastUpdated}</span>}
                </p>
              )}
            </>
          }
        />

        {/* Body */}
        {/* Contact's archived prose is just duplicate contact fragments — the structured
            section below carries everything, so its article body is skipped entirely. */}
        {!isContact && (
        /* Tighter top padding than the default .section: the hero is now a
           compact banner rather than a 752px photo slab, so the old spacing
           left an obvious dead gap before the first line of copy. */
        <article className="section pt-12 sm:pt-14 lg:pt-16">
          <div className="container-x">
            {/* `container-article`, NOT `mx-auto max-w-…`: this frame is the same
                one PageHero lays its title out in, and it is left-aligned. When
                it was centred, body copy started at x=224 while the h1 above it
                started at x=52 — a page title and its own first paragraph shared
                no edge. */}
            {withForm ? (
              <div className="container-article">
                {doc.metaDescription && (
                  <p className="prose-col mb-6 break-words text-lg leading-relaxed text-navy-900/80">{doc.metaDescription}</p>
                )}
                {/* prose-col keeps the measure at ~64 characters. Unconstrained
                    in a 3xl wrapper this branch ran to 80 cpl, well past
                    comfortable, while the sidebar branch sat at 64. */}
                <div className="prose-col">
                  <Prose sections={sections} />
                </div>
              </div>
            ) : (
              /* Single column. There used to be a 320px right rail holding a
                 sticky CTA tile; the tile has moved into the closing CTA band,
                 so nothing is beside the prose any more and the reading column
                 is centred in the container rather than pinned to the left with
                 dead space down the right. */
              <div className="container-article">
                <div className="prose-col">
                  {doc.metaDescription && doc.type !== "post" && (
                    <p className="mb-6 break-words text-lg leading-relaxed text-navy-900/80">{doc.metaDescription}</p>
                  )}
                  {isFaq ? (
                    <FaqAccordion items={buildFaq(bodyBlocks)} />
                  ) : (
                    <Prose sections={sections} />
                  )}

                  {doc.type === "post" && (
                    <div className="mt-12 border-t border-navy-100 pt-6">
                      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back to all articles
                      </Link>
                    </div>
                  )}
                </div>

                {/* Held to the reading measure, not the full container: the
                    "Dedicated Team" h2 that introduces these cards lives in the
                    prose flow, and breaking the grid out wider than its own
                    heading gave the section two different left edges. */}
                {slugPath === "/about" && (
                  <div className="prose-col">
                    <TeamPreview />
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
        )}

        {/* Facility gallery */}
        {isFacility && (
          <section className="bg-sand-50 section">
            <div className="container-x">
              <div className="mx-auto max-w-2xl text-center">
                <span className="eyebrow">Explore Our Space</span>
                <h2 className="mt-3 h-section text-navy-900">A closer look inside</h2>
                <p className="mt-4 leading-relaxed text-navy-900/70">
                  A sophisticated, 6-bed boutique setting in San Francisco&rsquo;s iconic Marina District, where
                  healing begins with peace and privacy.
                </p>
              </div>
              <div className="mt-10">
                <FacilityGallery />
              </div>
            </div>
          </section>
        )}

        {/* Insurance verification form */}
        {isAdmission && (
          <section id="verify" className="scroll-mt-24 bg-sand-50 section">
            <div className="container-x grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="eyebrow">Insurance &amp; Admissions</span>
                <h2 className="mt-3 h-section text-navy-900">Verify your benefits in minutes</h2>
                <p className="mt-5 leading-relaxed text-navy-900/70">
                  Financial barriers should never stand between you and life-saving treatment. Share a few details and
                  our admissions team will confidentially review your coverage — with no obligation. Prefer to talk?
                  Call us any time at{" "}
                  <a href={site.phones.primary.href} className="font-semibold text-orange-600">{site.phones.primary.label}</a>.
                </p>
                <ul className="mt-8 grid gap-4">
                  {[
                    "100% free & confidential benefits check",
                    "Most major PPO plans accepted",
                    "A real coordinator responds — not a bot",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3 text-navy-900/80">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <LeadForm intent="verify" />
            </div>
          </section>
        )}

        {/* Contact: map + message form */}
        {isContact && (
          <section className="bg-sand-50 section">
            <div className="container-x grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="eyebrow">Get In Touch</span>
                <h2 className="mt-3 h-section text-navy-900">We&rsquo;re here around the clock</h2>
                <ul className="mt-6 grid gap-5 text-navy-900/80">
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                    <a href={site.phones.primary.href} className="font-semibold hover:text-orange-600">{site.phones.primary.label}</a>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                    <span>{site.address.street}<br />{site.address.city}, {site.address.state} {site.address.zip}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" /> Open 24 hours · 7 days a week
                  </li>
                </ul>
                <div className="mt-8 overflow-hidden rounded-3xl border border-navy-100 bg-sand-100 shadow-soft">
                  <ConsentMap query={mapsQuery} />
                </div>
                <a
                  href={site.address.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  <MapPin className="h-4 w-4" /> View on Google Maps <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <LeadForm intent="contact" />
            </div>
          </section>
        )}

        {/* /about renders the roster inline via <TeamPreview /> — faces, roles
            and per-person links. A separate full-width "meet the team" band used
            to sit here as well, which made three team CTAs stack in a row. */}

        <Related doc={doc} />
        <CTASection />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
