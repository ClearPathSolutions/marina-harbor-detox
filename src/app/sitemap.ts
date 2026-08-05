import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllDocs, pathSegments, postDate, TEAM_SLUGS } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/blog/archive`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Staff bios redirect to /about/team, so they must not be submitted as URLs.
  const retired = new Set(TEAM_SLUGS.map((s) => s.replace(/__/g, "/")));
  entries.push({ url: `${site.url}/about/team`, changeFrequency: "monthly", priority: 0.7 });

  for (const doc of getAllDocs()) {
    const path = pathSegments(doc.url).join("/");
    if (!path || path === "blog" || retired.has(path)) continue;
    entries.push({
      url: `${site.url}/${path}`,
      changeFrequency: doc.type === "post" ? "monthly" : "monthly",
      priority: doc.type === "post" ? 0.6 : 0.7,
      lastModified: postDate(doc.url)?.iso,
    });
  }

  return entries;
}
