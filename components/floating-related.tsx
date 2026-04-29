"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

type RelatedPost = {
  url: string;
  frontmatter: { title: string };
  section: string;
};

export function FloatingRelated({ related }: { related: RelatedPost[] }) {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const header = document.querySelector("[data-article-header]");
    if (!header) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "0px 0px 0px 0px" }
    );
    obs.observe(header);
    return () => obs.disconnect();
  }, []);

  if (!related.length) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="floating-related"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          aria-label="Articles liés"
        >
          <div className="floating-related__header">
            <span className="floating-related__label">Voir aussi</span>
            <button
              className="floating-related__toggle"
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Développer" : "Réduire"}
            >
              {collapsed ? "+" : "−"}
            </button>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
                style={{ overflow: "hidden" }}
              >
                {related.slice(0, 3).map((rel) => (
                  <li key={rel.url}>
                    <Link href={rel.url} className="floating-related__link">
                      {rel.frontmatter.title}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
