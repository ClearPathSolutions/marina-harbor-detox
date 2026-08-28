import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { BIO_SLUGS, getAllDocs, networkLeadership, pathSegments, postDate } from "@/lib/content";

// MH-35 — every submitted URL must be the trailing-slash form, which is what
// this build now serves (next.config.mjs `trailingSlash: true`) and what the
// canonical tags emit. A sitemap that lists the slashless form would submit 117
// URLs that each 308, which is the "canonical pointing at a redirect" defect in
// reverse and exactly what MH-36's acceptance criterion forbids.
const url = (path = "") => `${site.url}/${path ? `${path}/` : ""}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: url(), changeFrequency: "weekly", priority: 1 },
    { url: url("blog"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("blog/archive"), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Bio JSON is content, not a route: the facility team redirects to /about/team,
  // so those URLs must not be submitted.
  const bios = new Set(BIO_SLUGS);
  entries.push({ url: url("about/team"), changeFrequency: "monthly", priority: 0.7 });

  // Network-leadership bios DO have pages, and they are linked from /about/team,
  // so they are submitted — but at a low priority: each canonicalises to the
  // group's original on quadranthealthgroup.com (see app/about/team/[slug]), so
  // this copy is not the one we are asking Google to index.
  for (const m of networkLeadership()) {
    entries.push({ url: url(`about/team/${m.slug}`), changeFrequency: "yearly", priority: 0.4 });
  }

  for (const doc of getAllDocs()) {
    const path = pathSegments(doc.url).join("/");
    if (!path || path === "blog" || bios.has(doc.slug)) continue;
    entries.push({
      url: url(path),
      changeFrequency: doc.type === "post" ? "monthly" : "monthly",
      priority: doc.type === "post" ? 0.6 : 0.7,
      lastModified: postDate(doc.url)?.iso,
    });
  }

  return entries;
}
