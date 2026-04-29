import Link from "next/link";
import { SECTION_LABELS, SECTIONS } from "@/lib/content";
import { NavSearchTrigger } from "./nav-search-trigger";

export function Nav() {
  return (
    <header className="site-container">
      <nav aria-label="Navigation principale" className="site-nav">
        {/* Brand — grid area 1/1 on mobile */}
        <Link
          href="/"
          className="site-nav__brand-link"
          style={{ fontWeight: 500, fontSize: "var(--text-sm)", letterSpacing: "-0.01em" }}
          aria-label="Accueil — Aboudou Zinsou"
        >
          Aboudou Zinsou
        </Link>

        {/* Links — row 2 on mobile (full width, scrollable) */}
        <ul role="list" className="site-nav__links">
          {SECTIONS.filter((s) => s !== "ressources").map((section) => (
            <li key={section}>
              <Link
                href={`/${section}`}
                style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300, whiteSpace: "nowrap" }}
              >
                {SECTION_LABELS[section]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/about"
              style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300, whiteSpace: "nowrap" }}
            >
              À propos
            </Link>
          </li>
        </ul>

        {/* Search — grid area 1/2 on mobile (same line as brand) */}
        <div className="site-nav__search">
          <NavSearchTrigger />
        </div>
      </nav>
    </header>
  );
}
