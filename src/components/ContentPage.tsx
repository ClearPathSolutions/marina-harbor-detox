import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import MobileCTABar from "./MobileCTABar";
import CTASection from "./CTASection";
import FacilityGallery from "./FacilityGallery";
import LeadForm from "./LeadForm";
import ConsentMap from "./ConsentMap";
import { ArrowRight, Check, ChevronDown, Clock, MapPin, Phone, Shield } from "./Icons";
import {
  type Block,
  type Doc,
  leadImage,
  pathSegments,
  postDate,
  readingTime,
  relatedLinks,
} from "@/lib/content";
import { site } from "@/lib/site";
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

type Section = { id: string; title: string | null; nodes: React.ReactNode[] };

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

function buildSections(blocks: Block[], heroH1: string): Section[] {
  const isHeadingH1 = (b: Block) => b.tag === "h1" && norm(b.text) !== norm(heroH1);
  const hasH2 = blocks.some((b) => b.tag === "h2" || isHeadingH1(b));
  const splitTag: Block["tag"] = hasH2 ? "h2" : "h3";
  const isBreak = (b: Block) => b.tag === splitTag || (splitTag === "h2" && isHeadingH1(b));

  const sections: Section[] = [];
  const seen = new Set<string>();
  let current: Section = { id: "", title: null, nodes: [] };
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    const items = [...list];
    current.nodes.push(
      <ul key={`ul-${current.nodes.length}`} className="my-6 space-y-3">
        {items.map((t, i) => (
          <li key={i} className="relative [overflow-wrap:anywhere] pl-7 leading-relaxed text-navy-900/75 before:absolute before:left-0 before:top-[0.55em] before:h-2 before:w-2 before:rounded-full before:bg-orange-500/90">
            {t}
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  const commit = () => {
    flushList();
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

  const push = (node: React.ReactNode) => current.nodes.push(node);

  blocks.forEach((b) => {
    if (isNoise(b)) return;
    if (b.tag === "li") {
      list.push(b.text);
      return;
    }
    flushList();
    if (isBreak(b)) {
      commit();
      current = { id: uniqueId(b.text), title: b.text, nodes: [] };
      return;
    }
    const key = current.nodes.length;
    if (b.tag === "h1" && norm(b.text) === norm(heroH1)) return; // hero echo
    if (b.tag === "h1" || b.tag === "h2")
      push(
        <h2 key={key} className="mt-10 scroll-mt-28 text-2xl font-bold text-navy-900 sm:text-3xl">
          {b.text}
        </h2>
      );
    else if (b.tag === "h3")
      push(
        <h3 key={key} className="mt-9 scroll-mt-28 text-xl font-bold text-navy-900">
          {b.text}
        </h3>
      );
    else if (b.tag === "h4")
      push(
        <h4 key={key} className="mt-7 scroll-mt-28 text-lg font-semibold text-navy-900">
          {b.text}
        </h4>
      );
    else if (b.tag === "blockquote")
      push(
        <blockquote key={key} className="my-8 rounded-r-2xl border-l-4 border-orange-500 bg-sand-50 py-5 pl-6 pr-5 text-lg italic leading-relaxed text-navy-900/80">
          {b.text}
        </blockquote>
      );
    else
      push(
        <p key={key} className="mt-5 break-words leading-[1.8] text-navy-900/75">
          {b.text}
        </p>
      );
  });
  commit();
  return sections;
}

/** Render built sections; each titled section is a visually separated <section>. */
function Prose({ sections }: { sections: Section[] }) {
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
        return (
          <section
            key={s.id || `intro-${i}`}
            id={s.id || undefined}
            className={
              separated
                ? "scroll-mt-28 [&:not(:first-child)]:mt-14 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-navy-100 [&:not(:first-child)]:pt-10"
                : empty
                  ? "scroll-mt-28 [&:not(:first-child)]:mt-12"
                  : "scroll-mt-28"
            }
          >
            {s.title && <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{s.title}</h2>}
            {s.nodes}
          </section>
        );
      })}
    </>
  );
}

/** Sticky desktop "On this page" jump nav (only when a page has enough sections). */
function TableOfContents({ sections }: { sections: Section[] }) {
  const items = sections.filter((s) => s.title);
  if (items.length < 3) return null;
  return (
    <nav aria-label="On this page" className="rounded-3xl border border-navy-100 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-700">On this page</p>
      <ul className="mt-3 space-y-2">
        {items.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block border-l-2 border-navy-100 pl-3 text-sm leading-snug text-navy-900/65 transition-colors hover:border-orange-500 hover:text-orange-600"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Collapsible "On this page" for phones, where the sidebar is hidden. */
function MobileToc({ sections }: { sections: Section[] }) {
  const items = sections.filter((s) => s.title);
  if (items.length < 3) return null;
  return (
    <details className="group mb-8 rounded-2xl border border-navy-100 bg-sand-50 p-4 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold uppercase tracking-wider text-navy-700">
        On this page
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="mt-3 space-y-2 border-t border-navy-100 pt-3">
        {items.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="block text-sm leading-snug text-navy-900/70 hover:text-orange-600">
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Sticky conversion card shown beside body copy on interior pages. */
function SidebarCTA() {
  return (
    <aside>
      <div className="overflow-hidden rounded-4xl border border-navy-100 bg-white shadow-card">
        <div className="bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-6 text-white">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
            <Clock className="h-4 w-4" /> Available 24/7
          </span>
          <p className="mt-3 text-lg font-bold leading-snug">Speak with a recovery advocate now</p>
          <a href={site.phones.primary.href} className="mt-4 flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-gold-400">
              <Phone className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] uppercase tracking-wider text-white/50">Call confidentially</span>
              <span className="font-display text-lg font-bold">{site.phones.primary.label}</span>
            </span>
          </a>
        </div>
        <div className="p-6">
          <Link href="/admission#verify" className="btn-orange w-full">
            Verify Your Insurance <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={site.sms} className="btn-outline-navy mt-3 w-full">Text Us Now</a>
          <ul className="mt-6 grid gap-3 text-sm text-navy-900/70">
            <li className="flex items-center gap-2.5"><Shield className="h-4 w-4 text-orange-500" /> Joint Commission Accredited</li>
            <li className="flex items-center gap-2.5"><Check className="h-4 w-4 text-orange-500" /> Most PPO insurance accepted</li>
            <li className="flex items-center gap-2.5"><MapPin className="h-4 w-4 text-orange-500" /> San Francisco, CA</li>
          </ul>
        </div>
      </div>
    </aside>
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
  const sections = buildSections(normalizeHeadings(bodyBlocks, doc.h1), doc.h1);

  const isFacility = slugPath === "/facility";
  const isAdmission = slugPath === "/admission";
  const isContact = slugPath === "/contact-location";
  const isAbout = slugPath === "/about";
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
            job (backing the title) instead of being decoration you scroll past. */}
        <section className="relative isolate overflow-hidden bg-navy-900">
          <div className="absolute inset-0 -z-10">
            {heroPhoto ? (
              <>
                <Image
                  src={heroPhoto}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
                {/* Copy has to stay legible over any photo in the set, so the
                    scrim is heaviest on the left where the text sits. */}
                <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/75 to-navy-950/50" />
              </>
            ) : (
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-700 via-navy-900 to-navy-950" />
                <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
              </div>
            )}
          </div>
          <div className="container-x section-sm">
            <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-white/50" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-orange-300">Home</Link>
              {crumbs.map((c) => (
                <span key={c.href} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  <Link href={c.href} className="hover:text-orange-300">{c.label}</Link>
                </span>
              ))}
            </nav>

            {doc.type === "post" && <span className="eyebrow mb-3 text-gold-400">Recovery Blog</span>}
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.1]">
              {doc.h1}
            </h1>
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
          </div>
        </section>

        {/* Body */}
        {/* Contact's archived prose is just duplicate contact fragments — the structured
            section below carries everything, so its article body is skipped entirely. */}
        {!isContact && (
        /* Tighter top padding than the default .section: the hero is now a
           compact banner rather than a 752px photo slab, so the old spacing
           left an obvious dead gap before the first line of copy. */
        <article className="section pt-12 sm:pt-14 lg:pt-16">
          <div className="container-x">
            {withForm ? (
              <div className="mx-auto max-w-3xl">
                {doc.metaDescription && (
                  <p className="mb-6 break-words text-lg leading-relaxed text-navy-900/80">{doc.metaDescription}</p>
                )}
                <MobileToc sections={sections} />
                <Prose sections={sections} />
              </div>
            ) : (
              <div className="mx-auto grid max-w-[62rem] gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
                <div className="min-w-0">
                  {doc.metaDescription && doc.type !== "post" && (
                    <p className="mb-6 break-words text-lg leading-relaxed text-navy-900/80">{doc.metaDescription}</p>
                  )}
                  <MobileToc sections={sections} />
                  <Prose sections={sections} />

                  {doc.type === "post" && (
                    <div className="mt-12 border-t border-navy-100 pt-6">
                      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back to all articles
                      </Link>
                    </div>
                  )}
                </div>
                <div className="hidden min-w-0 lg:block">
                  <div className="space-y-6 lg:sticky lg:top-28">
                    <TableOfContents sections={sections} />
                    <SidebarCTA />
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>
        )}

        {/* Facility gallery */}
        {isFacility && (
          <section className="bg-sand-50 section">
            <div className="container-wide">
              <div className="mx-auto max-w-2xl text-center">
                <span className="eyebrow">Explore Our Space</span>
                <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">A closer look inside</h2>
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
                <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">Verify your benefits in minutes</h2>
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
                <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">We&rsquo;re here around the clock</h2>
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
                <div className="mt-8 overflow-hidden rounded-4xl border border-navy-100 bg-sand-100 shadow-soft">
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

        {/* The team is presented on /about/team, in one consistent layout. A
            second portal-fed grid used to render here too, which duplicated the
            same three people and, with one card in a 3-column grid, left two
            thirds of the row empty. */}
        {isAbout && (
          <section className="border-t border-navy-100 bg-sand-50 section">
            <div className="container-x text-center">
              <span className="eyebrow">Our Clinical Team</span>
              <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
                The people caring for you
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-navy-900/70">
                A small, senior team — you will meet the same faces throughout your stay.
              </p>
              <Link href="/about/team" className="btn-navy mt-8">
                Meet the team <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        <Related doc={doc} />
        <CTASection />
      </main>
      <Footer />
      <MobileCTABar />
    </>
  );
}
