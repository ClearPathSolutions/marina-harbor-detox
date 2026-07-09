import fs from "fs";
import path from "path";
import manifest from "../../content/media-manifest.json";
import { nav } from "./site";

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
const media = manifest as Record<string, string>;

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

const baseKey = (u: string) => u.replace(/-\d+x\d+(?=\.[a-z]+)/i, "").replace(/\.webp$/i, "");

/** Map any WordPress upload URL (any size variant) to its local /media path, or null. */
export function localImage(url?: string): string | null {
  if (!url) return null;
  return media[baseKey(url.split("?")[0])] ?? null;
}

/** Best hero image for a doc: prefer og:image, else first content image that resolves locally. */
export function leadImage(doc: Doc): string | null {
  const og = localImage(doc.ogImage);
  if (og) return og;
  for (const img of doc.images) {
    const local = localImage(img);
    if (local) return local;
  }
  return null;
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
