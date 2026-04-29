import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Nav } from "@/components/nav";
import { ReadingProgress } from "@/components/reading-progress";
import { ArticleEntrance } from "@/components/article-motion";
import { CopyCodeButtons } from "@/components/code-copy";
import {
  getPostBySlug,
  getPostsForSection,
  getRelatedPosts,
  SECTIONS,
  SECTION_LABELS,
} from "@/lib/content";
import type { Section } from "@/lib/content";
import { remarkResolveLinks } from "@/lib/cross-links";
import type { Metadata } from "next";

type Props = { params: Promise<{ section: string; slug: string }> };

export async function generateStaticParams() {
  return SECTIONS.flatMap((section) =>
    getPostsForSection(section).map((post) => ({
      section,
      slug: post.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const post = getPostBySlug(section as Section, slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkResolveLinks],
    rehypePlugins: [rehypeSlug],
  },
};

export default async function ArticlePage({ params }: Props) {
  const { section, slug } = await params;

  if (!SECTIONS.includes(section as Section)) notFound();

  const post = getPostBySlug(section as Section, slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  return (
    <>
      <ReadingProgress />
      <Nav />

      <main className="site-container">
        <ArticleEntrance>
          {/* Header */}
          <header style={{ paddingBlock: "3rem 2.5rem" }}>
            <p style={{ fontSize: "var(--text-xs)", color: "#555", marginBottom: "1.25rem" }}>
              <Link href={`/${section}`} style={{ color: "#888888" }}>
                {SECTION_LABELS[section as Section]}
              </Link>
            </p>

            <h1
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: "1rem",
                maxWidth: "22ch",
              }}
            >
              {post.frontmatter.title}
            </h1>

            <p
              style={{ fontSize: "var(--text-xs)", color: "#888888" }}
              aria-label="Métadonnées de l'article"
            >
              {formatDate(post.frontmatter.date)}
              {post.frontmatter.date && " · "}
              {post.readingTime}
              {post.frontmatter.updated &&
                post.frontmatter.updated !== post.frontmatter.date && (
                  <> · mis à jour {formatDate(post.frontmatter.updated)}</>
                )}
            </p>

            {(post.frontmatter.github || post.frontmatter.npm) && (
              <p style={{ marginTop: "0.875rem", fontSize: "var(--text-xs)", color: "#555" }}>
                {post.frontmatter.github && (
                  <a
                    href={post.frontmatter.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: "1rem" }}
                  >
                    GitHub →
                  </a>
                )}
                {post.frontmatter.npm && (
                  <a
                    href={post.frontmatter.npm}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    npm →
                  </a>
                )}
              </p>
            )}
          </header>

          <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "2.5rem" }} />

          {/* Body */}
          <article className="prose" aria-label="Contenu de l'article">
            <MDXRemote source={post.content} options={mdxOptions} />
          </article>

          <CopyCodeButtons />

          {/* Related */}
          {related.length > 0 && (
            <aside
              style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #1e1e1e" }}
              aria-label="Articles liés"
            >
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "1.25rem",
                }}
              >
                Voir aussi
              </p>
              <ul role="list" style={{ listStyle: "none" }}>
                {related.map((rel) => (
                  <li key={rel.url}>
                    <Link href={rel.url} className="post-item" aria-label={rel.frontmatter.title}>
                      <span className="post-item__title">{rel.frontmatter.title}</span>
                      <span className="post-item__meta">{SECTION_LABELS[rel.section]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <footer style={{ paddingBlock: "4rem 3rem" }}>
            <Link href={`/${section}`} style={{ fontSize: "var(--text-xs)", color: "#555" }}>
              ← {SECTION_LABELS[section as Section]}
            </Link>
          </footer>
        </ArticleEntrance>
      </main>
    </>
  );
}
