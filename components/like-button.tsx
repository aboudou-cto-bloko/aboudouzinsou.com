"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const key = `like:${slug}`;

  useEffect(() => {
    try { setLiked(!!localStorage.getItem(key)); } catch {}
    fetch(`/api/likes/${slug}`)
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, [slug, key]);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setCount((c) => (c === null ? (next ? 1 : 0) : Math.max(0, c + (next ? 1 : -1))));
    try { next ? localStorage.setItem(key, "1") : localStorage.removeItem(key); } catch {}
    try {
      const res = await fetch(`/api/likes/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: next ? "like" : "unlike" }),
      });
      const data = await res.json();
      setCount(data.count);
    } catch {}
    setBusy(false);
  }

  return (
    <motion.button
      className={`like-btn${liked ? " like-btn--active" : ""}`}
      onClick={toggle}
      whileTap={{ scale: 0.82 }}
      aria-label={liked ? "Retirer le like" : "Liker"}
      aria-pressed={liked}
    >
      <AnimatePresence mode="wait" initial={false}>
        {liked ? (
          <motion.span
            key="filled"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [1.4, 0.9, 1.1, 1], opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            ♥
          </motion.span>
        ) : (
          <motion.span
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            ♡
          </motion.span>
        )}
      </AnimatePresence>
      {count !== null && count > 0 && (
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {fmt(count)}
        </motion.span>
      )}
    </motion.button>
  );
}
