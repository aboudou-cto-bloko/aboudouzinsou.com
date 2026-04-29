import { PostFeed } from "@/components/post-feed";
import { TypewriterHeadline } from "@/components/typewriter-headline";
import { getRecentPosts, getPostsForSection, SECTIONS } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aboudou Zinsou",
  description:
    "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
};

export default function HomePage() {
  const posts = getRecentPosts(100);

  const counts = SECTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: getPostsForSection(s).length }),
    {} as Record<string, number>
  );

  const feedPosts = posts.map((p) => ({
    slug: p.slug,
    section: p.section,
    url: p.url,
    frontmatter: { title: p.frontmatter.title, date: p.frontmatter.date },
    excerpt: p.excerpt,
    readingTime: p.readingTime,
  }));

  return (
    <main className="site-container">
      {/* Tagline */}
      <section className="tagline-section">
        <TypewriterHeadline />
        <p className="tagline-sub">
          Builder SaaS · Cotonou, Bénin · Marché africain francophone
        </p>

        <div className="content-badges">
          {counts.articles > 0 && (
            <span className="badge">{counts.articles} article{counts.articles > 1 ? "s" : ""}</span>
          )}
          {counts.insights > 0 && (
            <span className="badge">{counts.insights} insight{counts.insights > 1 ? "s" : ""}</span>
          )}
          {counts.tutoriels > 0 && (
            <span className="badge">{counts.tutoriels} tutoriel{counts.tutoriels > 1 ? "s" : ""}</span>
          )}
          {counts.devlog > 0 && (
            <span className="badge">{counts.devlog} devlog{counts.devlog > 1 ? "s" : ""}</span>
          )}
        </div>
      </section>

      {/* Feed */}
      <section aria-label="Publications">
        <PostFeed posts={feedPosts} />
      </section>

      <footer style={{ paddingBlock: "5rem 3rem" }}>
        <p style={{ fontSize: "var(--text-xs)", color: "#555" }}>
          <a href="https://github.com/aboudou-cto-bloko" target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}
          <a href="https://www.linkedin.com/in/fran%C3%A7oisab8099316/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {" · "}
          <a href="https://pixel-mart-bj.com" target="_blank" rel="noopener noreferrer">Pixel-Mart</a>
          {" · "}
          <a href="https://npmjs.com/package/moneroo" target="_blank" rel="noopener noreferrer">moneroo</a>
        </p>
      </footer>
    </main>
  );
}
