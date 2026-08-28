import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { BIO_SLUGS, getAllDocs, getDocBySegments, leadImage, pathSegments } from "@/lib/content";
import { site } from "@/lib/site";

// Only build the archived pages/posts; anything else 404s.
export const dynamicParams = false;

type Params = { slug: string[] };

export function generateStaticParams(): Params[] {
  // Staff bios are not routes of their own here — the facility team lives on
  // /about/team, and next.config.mjs redirects the old per-person URLs there;
  // network leadership is served by app/about/team/[slug]. Their JSON stays put;
  // teamMembers()/networkLeadership() still read it for the bio copy.
  const bios = new Set(BIO_SLUGS);
  return getAllDocs()
    .filter((d) => !bios.has(d.slug))
    .map((d) => pathSegments(d.url))
    .filter((seg) => seg.length > 0 && seg.join("/") !== "blog")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySegments(slug);
  if (!doc) return {};
  const img = leadImage(doc);
  // MH-21 — the archived URLs carry a trailing slash, but this build serves the
  // slashless form and 308-redirects the slash form, so emitting `/about/` pointed
  // both the canonical and og:url at a redirect. A canonical that redirects is the
  // defect V0067 flags on Laguna; strip it so the tag is self-referential and
  // agrees with sitemap.ts, which already emits the slashless form.
  //
  // This does NOT pre-empt MH-35 (the portfolio-wide trailing-slash decision). If
  // that lands on trailing slashes, set `trailingSlash: true` in next.config.mjs —
  // Next then serves and emits the slash form, and canonical + sitemap follow
  // automatically because both derive from the same pathname.
  const canonicalPath = new URL(doc.url).pathname.replace(/\/$/, "") || "/";
  // Thin transactional confirmation page shouldn't appear in search results.
  const noindex = canonicalPath === "/thank-you";
  return {
    title: doc.title,
    description: doc.metaDescription,
    alternates: { canonical: canonicalPath },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: doc.title,
      description: doc.metaDescription,
      url: canonicalPath,
      type: doc.type === "post" ? "article" : "website",
      // Defining openGraph here stops the root layout's images from being
      // inherited, so pages with no usable hero need the fallback spelled out.
      images: [img ?? site.ogFallback],
    },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDocBySegments(slug);
  if (!doc) notFound();
  return <ContentPage doc={doc} />;
}
