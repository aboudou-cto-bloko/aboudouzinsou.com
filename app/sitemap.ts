import type { MetadataRoute } from "next";
import { getAllPosts, SECTIONS } from "@/lib/content";

const BASE = "https://aboudouzinsou.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/links`, changeFrequency: "monthly", priority: 0.6 },
    ...SECTIONS.map((s) => ({
      url: `${BASE}/${s}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${BASE}${p.url}`,
      lastModified: p.frontmatter.updated ?? p.frontmatter.date,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
