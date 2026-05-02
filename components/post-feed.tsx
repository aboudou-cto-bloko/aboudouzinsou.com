"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { PostStats } from "./post-stats";

const PAGE_SIZE = 12;

const SECTION_LABELS: Record<string, string> = {
  articles:   "Articles",
  tutoriels:  "Tutoriels",
  insights:   "Insights",
  devlog:     "Devlog",
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

function coverUrl(title: string, section: string, tags?: string[], readingTime?: string): string {
  const p = new URLSearchParams({
    t: title,
    s: section,
    ...(tags?.length ? { g: tags.slice(0, 3).join(",") } : {}),
    ...(readingTime ? { r: readingTime } : {}),
  });
  return `/api/cover?${p.toString()}`;
}

type FeedPost = {
  slug: string;
  section: string;
  url: string;
  frontmatter: { title: string; date?: string; tags?: string[] };
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
          const src = coverUrl(
            post.frontmatter.title,
            post.section,
            post.frontmatter.tags,
            post.readingTime,
          );
          return (
            <li
              key={`${post.section}-${post.slug}`}
              className="feed-item-enter"
              style={{ animationDelay: `${(i % PAGE_SIZE) * 28}ms` }}
            >
              <Link href={post.url} className="post-item post-item--feed">
                <div className="post-item__body">
                  {/* Cover */}
                  <div className="post-cover-wrap">
                    <Image
                      src={src}
                      alt=""
                      width={800}
                      height={400}
                      className="post-cover"
                      loading="lazy"
                      unoptimized
                    />
                  </div>

                  <span className="post-item__title">{post.frontmatter.title}</span>
                  {post.excerpt && (
                    <span className="post-item__excerpt">{post.excerpt}</span>
                  )}
                  <div className="post-item__footer">
                    <PostStats slug={statsSlug} />
                    <span className="badge badge--meta">{post.readingTime}</span>
                    <span className="badge">{SECTION_LABELS[post.section] ?? post.section}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "#666" }}>
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
