"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const SECTION_LABELS: Record<string, string> = {
  articles: "Articles",
  tutoriels: "Tutoriels",
  insights: "Insights",
  devlog: "Devlog",
  ressources: "Ressources",
};

type SearchPost = {
  slug: string;
  section: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  readingTime: string;
  excerpt?: string;
};

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchPost[]>([]);
  const [results, setResults] = useState<SearchPost[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && posts.length === 0) {
      fetch("/api/search")
        .then((r) => r.json())
        .then(setPosts)
        .catch(() => {});
    }
  }, [open, posts.length]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(
      posts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.excerpt?.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 8)
    );
  }, [query, posts]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onCustom);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-search", onCustom); };
  }, []);

  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 60); }
    else { setQuery(""); setResults([]); }
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="search-modal"
              role="dialog"
              aria-label="Recherche"
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <input
                ref={inputRef}
                type="search"
                placeholder="Rechercher articles, insights, tutoriels…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
                autoComplete="off"
              />

              <AnimatePresence mode="wait">
                {results.length > 0 && (
                  <motion.ul
                    className="search-results"
                    role="listbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {results.map((post) => (
                      <li key={post.url} role="option">
                        <Link
                          href={post.url}
                          className="search-result"
                          onClick={() => setOpen(false)}
                        >
                          <span className="search-result__title">{post.title}</span>
                          <span className="search-result__meta">
                            <span className="badge">{SECTION_LABELS[post.section] ?? post.section}</span>
                            {post.readingTime}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
                {query.trim() && results.length === 0 && posts.length > 0 && (
                  <motion.p
                    className="search-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Aucun résultat pour &ldquo;{query}&rdquo;
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
