import { type ArticleByline, type BylinePerson, type Block, type Doc, postDate } from "./content";
import { ORGANIZATION_ID } from "./editorial";
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
 *   • A named `author` on BlogPosting unless the post's `written_by` field sets
 *     one — authorship is otherwise contested and blocked on D-3 / MH-15.
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

const person = (p: BylinePerson) => ({ "@type": "Person", name: p.name, url: abs(p.bioPath) });

/**
 * Post schema, per the editorial policy package's schema/clinical-article.jsonld:
 * a MedicalWebPage + BlogPosting graph. `reviewedBy` / `lastReviewed` appear
 * only when the post has both a reviewer and a review date (no default
 * reviewer). `author` is the named writer when `written_by` is set, otherwise
 * the site's existing editorial entity (the one Organization node, by @id).
 * People are inline Person nodes: bio pages with Person schema of their own
 * have not been built yet.
 */
export function blogPostingSchema(doc: Doc, path: string, image: string | null, byline: ArticleByline) {
  const d = postDate(doc.url);
  // Trailing slash, matching the canonical (next.config.mjs `trailingSlash`).
  const url = abs(path.endsWith("/") ? path : `${path}/`);
  const org = { "@id": ORGANIZATION_ID };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": `${url}#webpage`,
        url,
        name: doc.h1 || doc.title,
        ...(byline.reviewer && byline.lastReviewed
          ? { lastReviewed: byline.lastReviewed, reviewedBy: person(byline.reviewer) }
          : {}),
        publisher: org,
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: doc.h1 || doc.title,
        description: doc.metaDescription,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        url,
        ...(image ? { image: abs(image) } : {}),
        ...(d ? { datePublished: d.iso, dateModified: d.iso } : {}),
        author: byline.author ? person(byline.author) : org,
        publisher: org,
      },
    ],
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

/**
 * `Person` for a bio page. `worksFor` defaults to this facility because that is
 * who the bios on this site are about; network leadership passes the group
 * instead, since saying Dr. Tambini works for Marina Harbor Detox would simply
 * be untrue — her oversight is Quadrant-wide.
 */
export function personSchema(
  doc: Doc,
  path: string,
  jobTitle: string | null,
  image: string | null,
  worksFor: Record<string, string> = { "@type": "MedicalBusiness", name: site.name, url: site.url },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: doc.h1 || doc.title,
    ...(jobTitle ? { jobTitle } : {}),
    ...(image ? { image: abs(image) } : {}),
    url: abs(path),
    worksFor,
  };
}
