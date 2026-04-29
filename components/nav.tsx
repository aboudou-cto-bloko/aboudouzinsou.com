import Link from "next/link";
import { SECTION_LABELS, SECTIONS } from "@/lib/content";

export function Nav() {
  return (
    <header className="site-container">
      <nav
        aria-label="Navigation principale"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "2rem",
          paddingBlock: "2.5rem",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{ fontWeight: 500, fontSize: "var(--text-sm)", letterSpacing: "-0.01em" }}
          aria-label="Accueil — Aboudou Zinsou"
        >
          Aboudou Zinsou
        </Link>

        <ul
          role="list"
          style={{ display: "flex", gap: "1.75rem", listStyle: "none" }}
        >
          {SECTIONS.filter((s) => s !== "ressources").map((section) => (
            <li key={section}>
              <Link
                href={`/${section}`}
                style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300 }}
              >
                {SECTION_LABELS[section]}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/about"
              style={{ fontSize: "var(--text-sm)", color: "#888888", fontWeight: 300 }}
            >
              À propos
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
