"use client";
import { useEffect, useState } from "react";

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// Module-level cache — one fetch shared across all PostStats instances per page load
let _cache: Record<string, { views: number; likes: number }> | null = null;
let _promise: Promise<Record<string, { views: number; likes: number }>> | null = null;

function fetchAll(): Promise<Record<string, { views: number; likes: number }>> {
  if (_cache) return Promise.resolve(_cache);
  if (_promise) return _promise;
  _promise = fetch("/api/stats/all")
    .then((r) => r.json())
    .then((d) => { _cache = d; return d; })
    .catch(() => { _promise = null; return {}; });
  return _promise;
}

export function PostStats({ slug }: { slug: string }) {
  const [stats, setStats] = useState<{ views: number; likes: number } | null>(null);

  useEffect(() => {
    fetchAll()
      .then((all) => setStats(all[slug] ?? { views: 0, likes: 0 }))
      .catch(() => {});
  }, [slug]);

  if (!stats || (stats.views === 0 && stats.likes === 0)) return null;

  return (
    <span className="post-stats" aria-label="Statistiques">
      {stats.likes > 0 && (
        <span className="badge badge--stat" title={`${stats.likes} like${stats.likes > 1 ? "s" : ""}`}>
          ♥ {fmt(stats.likes)}
        </span>
      )}
      {stats.views > 0 && (
        <span className="badge badge--stat" title={`${stats.views} vue${stats.views > 1 ? "s" : ""}`}>
          {fmt(stats.views)} vues
        </span>
      )}
    </span>
  );
}
