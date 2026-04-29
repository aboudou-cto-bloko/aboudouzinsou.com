import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsForSection, SECTION_LABELS, SECTIONS } from "@/lib/content";
import type { Section, Post } from "@/lib/content";
import type { Metadata } from "next";

type Props = { params: Promise<{ section: string }> };

export async function generateStaticParams() {
  return SECTIONS.map((section) => ({ section }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  if (!SECTIONS.includes(section as Section)) return {};
  return { title: SECTION_LABELS[section as Section] };
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

function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul role="list" style={{ listStyle: "none" }}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={post.url} className="post-item post-item--section" aria-label={post.frontmatter.title}>
            <div className="post-item__body">
              <span className="post-item__title">{post.frontmatter.title}</span>
              {post.excerpt && <span className="post-item__excerpt">{post.excerpt}</span>}
            </div>
            <span className="post-item__meta">
              <span className="badge badge--meta">{post.readingTime}</span>
              {post.frontmatter.date && <span>{formatDate(post.frontmatter.date)}</span>}
            </span>
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
          <section style={{ paddingBlock: "3rem 4rem" }}>
            <h1
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {label}
            </h1>
          </section>

          <section aria-label={`Liste ${label.toLowerCase()}`}>
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
                  <PostList posts={group.posts} />
                </div>
              ))
            ) : (
              <PostList posts={ungrouped} />
            )}
          </section>

          <footer style={{ paddingBlock: "5rem 3rem" }}>
            <Link href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
              ← Accueil
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
