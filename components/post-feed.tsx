"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PostStats } from "./post-stats";

const PAGE_SIZE = 12;

const SECTION_LABELS: Record<string, string> = {
  articles: "Articles",
  tutoriels: "Tutoriels",
  insights: "Insights",
  devlog: "Devlog",
  ressources: "Ressources",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type FeedPost = {
  slug: string;
  section: string;
  url: string;
  frontmatter: { title: string; date?: string };
  excerpt: string;
  readingTime: string;
};

export function PostFeed({ posts }: { posts: FeedPost[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shown = posts.slice(0, visible);
  const hasMore = visible < posts.length;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    setLoading(true);
    setTimeout(() => {
      setVisible((v) => v + PAGE_SIZE);
      setLoading(false);
    }, 380);
  }, [hasMore, loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "180px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <ul role="list" style={{ listStyle: "none" }}>
        {shown.map((post, i) => {
          const statsSlug = `${post.section}/${post.slug}`;
          return (
            <li
              key={`${post.section}-${post.slug}`}
              className="feed-item-enter"
              style={{ animationDelay: `${(i % PAGE_SIZE) * 28}ms` }}
            >
              <Link href={post.url} className="post-item post-item--feed">
                <div className="post-item__body">
                  <span className="post-item__title">{post.frontmatter.title}</span>
                  {post.excerpt && (
                    <span className="post-item__excerpt">{post.excerpt}</span>
                  )}
                  <div className="post-item__footer">
                    <PostStats slug={statsSlug} />
                    <span className="badge badge--meta">{post.readingTime}</span>
                    <span className="badge">{SECTION_LABELS[post.section] ?? post.section}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "#444" }}>
                      {formatDate(post.frontmatter.date)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <div ref={sentinelRef} className="feed-sentinel">
          {loading && (
            <span className="feed-loader">
              <span /><span /><span />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
