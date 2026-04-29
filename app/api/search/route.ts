import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    section: p.section,
    url: p.url,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    tags: p.frontmatter.tags,
    readingTime: p.readingTime,
    excerpt: p.excerpt,
  }));
  return NextResponse.json(posts);
}
