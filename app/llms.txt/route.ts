import { getAllPosts, SECTIONS, SECTION_LABELS } from "@/lib/content";
import type { Section } from "@/lib/content";

const BASE = "https://aboudouzinsou.com";

export const dynamic = "force-static";
export const revalidate = 86400; // 24h

export function GET() {
  const allPosts = getAllPosts().filter((p) => p.frontmatter.status === "published");

  const sectionBlocks = SECTIONS.map((section) => {
    const posts = allPosts.filter((p) => p.section === section);
    if (posts.length === 0) return null;

    const lines = posts
      .map((p) => {
        const desc = p.excerpt ? `: ${p.excerpt}` : "";
        return `- [${p.frontmatter.title}](${BASE}${p.url})${desc}`;
      })
      .join("\n");

    return `## ${SECTION_LABELS[section as Section]}\n\n${lines}`;
  }).filter(Boolean);

  const body = `# Aboudou Zinsou

> Dev full-stack SaaS, marché africain francophone. Je construis des produits. J'écris ce que j'apprends.

François Mawutô Aboudou ZINSOU est développeur full-stack basé à Cotonou, Bénin. Il construit des produits SaaS (BLOKO, Pixel-Mart, PLR, Moneroo SDK) et écrit sur l'IA, les systèmes RAG, le second cerveau Obsidian, Next.js, Convex et le développement de SaaS en Afrique francophone.

Stack principale : Next.js · TypeScript · Convex · Tailwind · Vercel · Moneroo.

${sectionBlocks.join("\n\n")}

## Liens

- [À propos](${BASE}/about): Présentation complète, stack, projets actifs
- [Projets](${BASE}/links): BLOKO, Pixel-Mart, PLR, Moneroo SDK, VitrinAI
- [RSS Feed](${BASE}/feed.xml): Flux de tous les articles récents
- [Contenu complet pour LLM](${BASE}/llms-full.txt): Texte intégral de tous les articles (pour ingestion)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
