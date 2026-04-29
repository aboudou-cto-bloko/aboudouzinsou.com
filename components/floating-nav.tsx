"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Home, Search, Link2, X, Menu } from "lucide-react";

const MY_LINKS = [
  { label: "GitHub", href: "https://github.com/aboudou-cto-bloko" },
  { label: "Pixel-Mart", href: "https://pixel-mart-bj.com" },
  { label: "moneroo", href: "https://npmjs.com/package/moneroo" },
];

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const fabVariants = (delay: number) => ({
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { delay, duration: 0.18, ease: EASE } },
  exit: { opacity: 0, y: 8, scale: 0.85, transition: { duration: 0.12 } },
});

export function FloatingNav() {
  const [open, setOpen] = useState(false);
  const [linksOpen, setLinksOpen] = useState(false);

  const openSearch = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-search"));
  };

  return (
    <>
      {/* Links bottom sheet */}
      <AnimatePresence>
        {linksOpen && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setLinksOpen(false)}
            />
            <motion.div
              className="links-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="links-sheet__handle" />
              <p className="links-sheet__label">Liens</p>
              <ul className="links-sheet__list">
                {MY_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="links-sheet__link"
                      onClick={() => setLinksOpen(false)}
                    >
                      {l.label}
                      <span style={{ color: "#555", fontSize: "var(--text-xs)" }}>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB cluster */}
      <div className="floating-nav" aria-label="Navigation rapide">
        <AnimatePresence>
          {open && (
            <>
              <motion.button
                className="fab-btn"
                onClick={openSearch}
                title="Rechercher"
                aria-label="Rechercher"
                variants={fabVariants(0.05)}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Search size={15} />
              </motion.button>

              <motion.div
                variants={fabVariants(0.1)}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link
                  href="/"
                  className="fab-btn"
                  title="Accueil"
                  aria-label="Accueil"
                  onClick={() => setOpen(false)}
                >
                  <Home size={15} />
                </Link>
              </motion.div>

              <motion.button
                className="fab-btn"
                onClick={() => { setLinksOpen(true); setOpen(false); }}
                title="Mes liens"
                aria-label="Mes liens"
                variants={fabVariants(0.15)}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Link2 size={15} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        <motion.button
          className="fab-btn fab-main"
          onClick={() => setOpen((o) => !o)}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ opacity: 0, rotate: -45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                <X size={16} />
              </motion.span>
            ) : (
              <motion.span key="m" initial={{ opacity: 0, rotate: 45 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                <Menu size={16} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
