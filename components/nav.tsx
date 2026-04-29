import Link from "next/link";
import { SECTION_LABELS, SECTIONS } from "@/lib/content";
import { NavSearchTrigger } from "./nav-search-trigger";

export function Nav() {
  return (
    <header className="site-container">
      <nav aria-label="Navigation principale" className="site-nav">
        <Link
          href="/"
          style={{ fontWeight: 500, fontSize: "var(--text-sm)", letterSpacing: "-0.01em", flexShrink: 0 }}
          aria-label="Accueil — Aboudou Zinsou"
        >
          Aboudou Zinsou
        </Link>

        <div className="site-nav__right">
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

          <NavSearchTrigger />
        </div>
      </nav>
    </header>
  );
}
