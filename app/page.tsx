import Link from "next/link";
import { Nav } from "@/components/nav";
import { ArticleEntrance } from "@/components/article-motion";
import { getRecentPosts, SECTION_LABELS } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aboudou Zinsou",
  description:
    "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });
}

export default function HomePage() {
  const posts = getRecentPosts(30);

  return (
    <>
      <Nav />

      <main className="site-container">
        <ArticleEntrance>
          <section style={{ paddingBlock: "3rem 4rem" }}>
            <p style={{ fontSize: "var(--text-sm)", color: "#888888", lineHeight: 1.6, maxWidth: "52ch" }}>
              Je construis des SaaS pour le marché africain francophone.
              J&apos;écris sur ce que j&apos;apprends en chemin.
            </p>
          </section>

          <section aria-label="Publications récentes">
            <ul role="list" style={{ listStyle: "none" }}>
              {posts.map((post) => (
                <li key={`${post.section}-${post.slug}`}>
                  <Link href={post.url} className="post-item" aria-label={post.frontmatter.title}>
                    <span className="post-item__title">{post.frontmatter.title}</span>
                    <span className="post-item__meta" aria-label="Section et date">
                      <span style={{ marginRight: "0.75rem", color: "#555" }}>
                        {SECTION_LABELS[post.section]}
                      </span>
                      {formatDate(post.frontmatter.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {posts.length === 0 && (
              <p style={{ color: "#888888", fontSize: "var(--text-sm)", paddingBlock: "3rem" }}>
                Aucun contenu pour l&apos;instant.
              </p>
            )}
          </section>

          <footer style={{ paddingBlock: "5rem 3rem" }}>
            <p style={{ fontSize: "var(--text-xs)", color: "#555" }}>
              <Link href="https://github.com/aboudou-cto-bloko">GitHub</Link>
              {" · "}
              <Link href="https://pixel-mart-bj.com">Pixel-Mart</Link>
              {" · "}
              <Link href="https://www.npmjs.com/package/moneroo">moneroo</Link>
            </p>
          </footer>
        </ArticleEntrance>
      </main>
    </>
  );
}
