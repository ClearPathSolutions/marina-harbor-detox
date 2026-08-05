import { type Block, type Doc, postDate } from "./content";
import { site } from "./site";

/**
 * MH-30 — per-page JSON-LD.
 *
 * The root layout emits one `MedicalBusiness` node for the organisation. This
 * builds the page-level graph that was missing: breadcrumbs (rendered but never
 * marked up), `BlogPosting` for posts, `FAQPage` for the rebuilt FAQ, and
 * `Person` for the staff bio pages.
 *
 * Deliberately NOT asserted here:
 *   • `author` on BlogPosting beyond the editorial entity — authorship is
 *     contested and blocked on D-3 / MH-15.
 *   • Any `reviewedBy` that the page does not already state in visible copy.
 */

const abs = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

export type Crumb = { label: string; href: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  const items = [{ label: "Home", href: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: abs(c.href),
    })),
  };
}

/** Question/answer pairs from a rebuilt FAQ page (h3 question followed by a p). */
export function faqPairs(blocks: Block[]): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  for (let i = 0; i < blocks.length - 1; i++) {
    if (blocks[i].tag === "h3" && blocks[i + 1].tag === "p") {
      out.push({ q: blocks[i].text, a: blocks[i + 1].text });
    }
  }
  return out;
}

export function faqSchema(blocks: Block[]) {
  const pairs = faqPairs(blocks);
  if (pairs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function blogPostingSchema(doc: Doc, path: string, image: string | null, reviewedBy: string | null) {
  const d = postDate(doc.url);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.h1 || doc.title,
    description: doc.metaDescription,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
    url: abs(path),
    ...(image ? { image: abs(image) } : {}),
    ...(d ? { datePublished: d.iso, dateModified: d.iso } : {}),
    // Editorial entity, not a named person — see D-3 / MH-15.
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: abs("/images/brand/logo-mark.png") },
    },
    ...(reviewedBy ? { reviewedBy: { "@type": "Person", name: reviewedBy } } : {}),
  };
}

/**
 * `MedicalWebPage` for clinical service pages, carrying the reviewer when the
 * page states one. Only emitted where a reviewer is actually named in the copy.
 */
export function medicalWebPageSchema(doc: Doc, path: string, reviewedBy: string | null) {
  if (!reviewedBy) return null;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: doc.h1 || doc.title,
    description: doc.metaDescription,
    url: abs(path),
    reviewedBy: { "@type": "Person", name: reviewedBy },
    about: { "@type": "MedicalCondition", name: "Substance use disorder" },
  };
}

export function personSchema(doc: Doc, path: string, jobTitle: string | null, image: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: doc.h1 || doc.title,
    ...(jobTitle ? { jobTitle } : {}),
    ...(image ? { image: abs(image) } : {}),
    url: abs(path),
    worksFor: { "@type": "MedicalBusiness", name: site.name, url: site.url },
  };
}
