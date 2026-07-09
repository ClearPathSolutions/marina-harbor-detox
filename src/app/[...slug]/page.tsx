import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getAllDocs, getDocBySegments, leadImage, pathSegments } from "@/lib/content";

// Only build the archived pages/posts; anything else 404s.
export const dynamicParams = false;

type Params = { slug: string[] };

export function generateStaticParams(): Params[] {
  return getAllDocs()
    .map((d) => pathSegments(d.url))
    .filter((seg) => seg.length > 0 && seg.join("/") !== "blog")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySegments(slug);
  if (!doc) return {};
  const img = leadImage(doc);
  const canonicalPath = new URL(doc.url).pathname;
  // Thin transactional confirmation page shouldn't appear in search results.
  const noindex = canonicalPath.replace(/\/$/, "") === "/thank-you";
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
      images: img ? [img] : undefined,
    },
  };
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDocBySegments(slug);
  if (!doc) notFound();
  return <ContentPage doc={doc} />;
}
