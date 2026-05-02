import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsForSection, SECTION_LABELS, SECTIONS } from "@/lib/content";
import type { Section, Post } from "@/lib/content";
import { PostStats } from "@/components/post-stats";
import { ProfileHero } from "@/components/profile-hero";
import { ProfileTabsNav } from "@/components/profile-tabs-nav";
import type { Metadata } from "next";

type Props = { params: Promise<{ section: string }> };

export async function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  articles: "Articles techniques sur le développement SaaS, Next.js, TypeScript et le marché africain francophone.",
  tutoriels: "Tutoriels pratiques : CLI Bash, second cerveau Obsidian, assistant IA RAG, intégrations paiement africain.",
  insights: "Notes courtes et observations sur le développement, Convex, les paiements en Afrique et les outils dev.",
  devlog: "Journal de bord des projets en cours — BLOKO, Pixel-Mart, PLR — décisions techniques et retours d'expérience.",
  ressources: "Ressources sélectionnées : snippets, prompts, outils et références pour développeurs full-stack.",
};

const BASE = "https://aboudouzinsou.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  if (!SECTIONS.includes(section as Section)) return {};
  const label = SECTION_LABELS[section as Section];
  const description = SECTION_DESCRIPTIONS[section] ?? `${label} — Aboudou Zinsou`;
  const url = `${BASE}/${section}`;
  return {
    title: label,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${label} — Aboudou Zinsou`, description },
    twitter: { card: "summary", title: `${label} — Aboudou Zinsou`, description },
  };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const TOPIC_LABELS: Record<string, string> = {
  convex: "Convex",
  paiements: "Paiements",
  outils: "Outils",
};

function PostList({ posts, section }: { posts: Post[]; section: string }) {
  return (
    <ul role="list" style={{ listStyle: "none" }}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={post.url} className="post-item post-item--section" aria-label={post.frontmatter.title}>
            <div className="post-item__body">
              <span className="post-item__title">{post.frontmatter.title}</span>
              {post.excerpt && <span className="post-item__excerpt">{post.excerpt}</span>}
              <div className="post-item__footer">
                <PostStats slug={`${section}/${post.slug}`} />
                <span className="badge badge--meta">{post.readingTime}</span>
                {post.frontmatter.date && (
                  <span style={{ fontSize: "var(--text-xs)", color: "#444" }}>
                    {formatDate(post.frontmatter.date)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  if (!SECTIONS.includes(section as Section)) notFound();

  const posts = getPostsForSection(section as Section);
  const label = SECTION_LABELS[section as Section];

  const counts = SECTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: getPostsForSection(s).length }),
    {} as Record<string, number>
  );
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Group by topic if posts have it (insights)
  const hasTopics = posts.some((p) => (p.frontmatter as { topic?: string }).topic);

  let grouped: { label: string; posts: Post[] }[] = [];
  let ungrouped: Post[] = [];

  if (hasTopics) {
    const topicMap = new Map<string, Post[]>();
    for (const post of posts) {
      const topic = (post.frontmatter as { topic?: string }).topic ?? "autres";
      if (!topicMap.has(topic)) topicMap.set(topic, []);
      topicMap.get(topic)!.push(post);
    }
    // Sort groups: known topics first, then alphabetical
    const knownOrder = ["convex", "paiements", "outils"];
    const sortedTopics = [...topicMap.keys()].sort((a, b) => {
      const ai = knownOrder.indexOf(a);
      const bi = knownOrder.indexOf(b);
      if (ai >= 0 && bi >= 0) return ai - bi;
      if (ai >= 0) return -1;
      if (bi >= 0) return 1;
      return a.localeCompare(b);
    });
    grouped = sortedTopics.map((t) => ({
      label: TOPIC_LABELS[t] ?? t,
      posts: (topicMap.get(t) ?? []).sort(
        (a, b) =>
          ((a.frontmatter as { order?: number }).order ?? 99) -
          ((b.frontmatter as { order?: number }).order ?? 99)
      ),
    }));
  } else {
    ungrouped = posts;
  }

  return (
    <>
      <main className="site-container">
        <div>
          <ProfileHero total={total} />
          <ProfileTabsNav active={section} counts={counts} />

          <section aria-label={`Liste ${label.toLowerCase()}`} style={{ paddingTop: "1.75rem" }}>
            {posts.length === 0 && (
              <p style={{ color: "#888888", fontSize: "var(--text-sm)" }}>
                Aucun contenu pour l&apos;instant.
              </p>
            )}

            {hasTopics ? (
              grouped.map((group) => (
                <div key={group.label} style={{ marginBottom: "3rem" }}>
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {group.label}
                  </p>
                  <PostList posts={group.posts} section={section} />
                </div>
              ))
            ) : (
              <PostList posts={ungrouped} section={section} />
            )}
          </section>

          <footer style={{ paddingBlock: "4rem 3rem" }}>
            <Link href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
              ← Accueil
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
