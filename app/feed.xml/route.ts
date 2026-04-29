import { getAllPosts } from "@/lib/content";
import { NextResponse } from "next/server";

const BASE = "https://aboudouzinsou.com";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts()
    .filter((p) => p.frontmatter.date)
    .slice(0, 25);

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.frontmatter.title}]]></title>
      <link>${BASE}${p.url}</link>
      <guid isPermaLink="true">${BASE}${p.url}</guid>
      <description><![CDATA[${p.excerpt}]]></description>
      <pubDate>${new Date(p.frontmatter.date!).toUTCString()}</pubDate>
      ${p.frontmatter.tags?.map((t) => `<category>${t}</category>`).join("") ?? ""}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aboudou Zinsou</title>
    <link>${BASE}</link>
    <description>Dev full-stack SaaS, marché africain francophone. J&apos;écris sur ce que je construis.</description>
    <language>fr</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
