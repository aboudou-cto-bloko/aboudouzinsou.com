import type { MetadataRoute } from "next";
import { getAllPosts, SECTIONS } from "@/lib/content";
import { PROJECTS } from "@/lib/projects";

const BASE = "https://aboudouzinsou.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/tarifs`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/projets`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE}/links`, changeFrequency: "monthly", priority: 0.6 },
    ...PROJECTS.map((p) => ({
      url: `${BASE}/projets/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.85 : 0.75,
    })),
    ...SECTIONS.map((s) => ({
      url: `${BASE}/${s}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => {
      const cp = new URLSearchParams({ t: p.frontmatter.title, s: p.section });
      if (p.frontmatter.tags?.length) cp.set("g", p.frontmatter.tags.slice(0, 3).join(","));
      if (p.readingTime) cp.set("r", p.readingTime);
      return {
        url: `${BASE}${p.url}`,
        lastModified: p.frontmatter.updated ?? p.frontmatter.date,
        changeFrequency: "monthly" as const,
        priority: p.section === "tutoriels" ? 0.9 : p.section === "articles" ? 0.85 : 0.7,
        images: [`${BASE}/api/cover?${cp.toString()}`],
      };
    }),
  ];
}
