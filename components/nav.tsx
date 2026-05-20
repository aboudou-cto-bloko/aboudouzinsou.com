import Link from "next/link";
import { NavSearchTrigger } from "./nav-search-trigger";

export function Nav() {
  return (
    <header className="site-container">
      <nav aria-label="Navigation principale" className="site-nav">
        <Link
          href="/"
          className="site-nav__brand-link"
          style={{ fontWeight: 500, fontSize: "var(--text-sm)", letterSpacing: "-0.01em" }}
          aria-label="Accueil — Aboudou Zinsou"
        >
          <span className="shimmer shimmer--slow">{"{AZ}"}</span>
        </Link>

        <ul role="list" className="site-nav__links">
          <li>
            <Link
              href="/projets"
              style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300 }}
            >
              Projets
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300 }}
            >
              À propos
            </Link>
          </li>
          <li>
            <Link
              href="/links"
              style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300 }}
            >
              Links
            </Link>
          </li>
        </ul>

        <div className="site-nav__search">
          <NavSearchTrigger />
        </div>
      </nav>
    </header>
  );
}
