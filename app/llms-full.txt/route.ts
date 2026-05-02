import { getAllPosts } from "@/lib/content";

const BASE = "https://aboudouzinsou.com";

export const dynamic = "force-static";
export const revalidate = 86400;

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[*-]\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function GET() {
  const posts = getAllPosts()
    .filter((p) => p.frontmatter.status === "published" && p.frontmatter.date)
    .sort((a, b) => new Date(b.frontmatter.date!).getTime() - new Date(a.frontmatter.date!).getTime());

  const header = `# aboudouzinsou.com — Contenu complet
Auteur : François Mawutô Aboudou ZINSOU
Site : ${BASE}
Généré : ${new Date().toISOString().split("T")[0]}
Articles : ${posts.length}

---

`;

  const entries = posts.map((p) => {
    const tags = p.frontmatter.tags?.join(", ") ?? "";
    return [
      `## ${p.frontmatter.title}`,
      `URL: ${BASE}${p.url}`,
      `Date: ${p.frontmatter.date ?? ""}`,
      tags ? `Tags: ${tags}` : "",
      `Lecture: ${p.readingTime}`,
      "",
      stripMarkdown(p.content),
      "",
      "---",
    ]
      .filter((l) => l !== null)
      .join("\n");
  });

  const body = header + entries.join("\n\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
