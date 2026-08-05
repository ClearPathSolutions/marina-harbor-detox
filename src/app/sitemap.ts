import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllDocs, pathSegments, postDate, TEAM_SLUGS } from "@/lib/content";

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

  // Staff bios redirect to /about/team, so they must not be submitted as URLs.
  const retired = new Set(TEAM_SLUGS.map((s) => s.replace(/__/g, "/")));
  entries.push({ url: url("about/team"), changeFrequency: "monthly", priority: 0.7 });

  for (const doc of getAllDocs()) {
    const path = pathSegments(doc.url).join("/");
    if (!path || path === "blog" || retired.has(path)) continue;
    entries.push({
      url: url(path),
      changeFrequency: doc.type === "post" ? "monthly" : "monthly",
      priority: doc.type === "post" ? 0.6 : 0.7,
      lastModified: postDate(doc.url)?.iso,
    });
  }

  return entries;
}
