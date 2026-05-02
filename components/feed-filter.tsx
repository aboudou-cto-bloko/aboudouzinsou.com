"use client";

import { useState } from "react";
import { PostFeed } from "./post-feed";

const SECTION_LABELS: Record<string, string> = {
  articles:   "Articles",
  insights:   "Insights",
  devlog:     "Devlog",
  tutoriels:  "Tutoriels",
  ressources: "Ressources",
};

type FeedPost = {
  slug: string;
  section: string;
  url: string;
  frontmatter: { title: string; date?: string; tags?: string[] };
  excerpt: string;
  readingTime: string;
};

type Props = {
  posts: FeedPost[];
  counts: Record<string, number>;
};

export function FeedFilter({ posts, counts }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? posts.filter((p) => p.section === active) : posts;
  const total = posts.length;

  return (
    <>
      <div className="profile-tabs" role="tablist" aria-label="Filtrer par section">
        <button
          role="tab"
          aria-selected={active === null}
          className={`profile-tab${active === null ? " profile-tab--active" : ""}`}
          onClick={() => setActive(null)}
        >
          Tout
          <span className="profile-tab-count">{total}</span>
        </button>

        {Object.entries(SECTION_LABELS).map(([section, label]) => {
          const count = counts[section] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={section}
              role="tab"
              aria-selected={active === section}
              className={`profile-tab${active === section ? " profile-tab--active" : ""}`}
              onClick={() => setActive(section)}
            >
              {label}
              <span className="profile-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* key force remount → reset pagination quand on change de filtre */}
      <section aria-label={active ? SECTION_LABELS[active] : "Toutes les publications"}>
        <PostFeed key={active ?? "all"} posts={filtered} />
      </section>
    </>
  );
}
