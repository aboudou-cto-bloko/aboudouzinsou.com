import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { ReadingProgress } from "@/components/reading-progress";
import { CopyCodeButtons } from "@/components/code-copy";
import { ViewCounter } from "@/components/view-counter";
import { LikeButton } from "@/components/like-button";
import { FloatingRelated } from "@/components/floating-related";
import { ShareButton } from "@/components/share-button";
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
    getPostsForSection(section).map((post) => ({ section, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  const post = getPostBySlug(section as Section, slug);
  if (!post) return {};
  return { title: post.frontmatter.title, description: post.frontmatter.description ?? post.excerpt };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxOptions: any = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkResolveLinks],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: "one-dark-pro", keepBackground: true }],
    ],
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

      <main className="site-container">
        {/* Header */}
        <header data-article-header style={{ paddingBlock: "2.5rem 2rem" }}>
          <nav aria-label="Fil d'ariane" className="breadcrumb">
            <Link href="/" className="breadcrumb__item">Accueil</Link>
            <span className="breadcrumb__sep" aria-hidden="true">/</span>
            <Link href={`/${section}`} className="breadcrumb__item">
              {SECTION_LABELS[section as Section]}
            </Link>
          </nav>

          <h1
            className="shimmer"
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

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="badge badge--meta">{post.readingTime}</span>
            {post.frontmatter.date && (
              <span style={{ fontSize: "var(--text-xs)", color: "#888888" }}>
                {formatDate(post.frontmatter.date)}
              </span>
            )}
            <ViewCounter slug={`${section}/${slug}`} />
            {post.frontmatter.tags?.map((tag) => (
              <span key={tag} className="badge badge--tag">#{tag}</span>
            ))}
          </div>
          <LikeButton slug={`${section}/${slug}`} />

          {(post.frontmatter.github || post.frontmatter.npm) && (
            <p style={{ marginTop: "0.875rem", fontSize: "var(--text-xs)", color: "#555" }}>
              {post.frontmatter.github && (
                <a href={post.frontmatter.github} target="_blank" rel="noopener noreferrer" style={{ marginRight: "1rem" }}>
                  GitHub →
                </a>
              )}
              {post.frontmatter.npm && (
                <a href={post.frontmatter.npm} target="_blank" rel="noopener noreferrer">npm →</a>
              )}
            </p>
          )}
        </header>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "2.5rem" }} />

        {/* Body */}
        <article className="prose" aria-label="Contenu">
          <MDXRemote source={post.content} options={mdxOptions} />
        </article>

        <CopyCodeButtons />

        {/* Related — inline section */}
        {related.length > 0 && (
          <aside
            style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid #1e1e1e" }}
            aria-label="Articles liés"
          >
            <p style={{ fontSize: "var(--text-xs)", color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1.25rem" }}>
              Voir aussi
            </p>
            <ul role="list" style={{ listStyle: "none" }}>
              {related.map((rel) => (
                <li key={rel.url}>
                  <Link href={rel.url} className="post-item">
                    <span className="post-item__title">{rel.frontmatter.title}</span>
                    <span className="post-item__meta">{SECTION_LABELS[rel.section]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Newsletter trigger sentinel */}
        <div data-newsletter-trigger aria-hidden="true" />

        <footer style={{ paddingBlock: "3rem" }}>
          <ShareButton title={post.frontmatter.title} />
          <div style={{ marginTop: "2rem" }}>
            <Link href={`/${section}`} style={{ fontSize: "var(--text-xs)", color: "#555" }}>
              ← {SECTION_LABELS[section as Section]}
            </Link>
          </div>
        </footer>
      </main>

      {/* Floating "Voir aussi" widget */}
      <FloatingRelated related={related} />
    </>
  );
}
