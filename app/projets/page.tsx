import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { StackBadge } from "@/components/stack-badge";
import { JsonLd } from "@/components/json-ld";
import {
  PROJECTS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  STATUS_LABELS,
  type Project,
} from "@/lib/projects";
import type { Metadata } from "next";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Projets — Aboudou Zinsou",
  description:
    "Marketplaces, outils fintech, SaaS, applications civiques — projets livrés sur le marché africain francophone.",
  alternates: { canonical: `${BASE}/projets` },
  openGraph: {
    type: "website",
    url: `${BASE}/projets`,
    title: "Projets — Aboudou Zinsou",
    description:
      "Marketplaces, outils fintech, SaaS, applications civiques — projets livrés sur le marché africain francophone.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Projets — Aboudou Zinsou",
  description:
    "Marketplaces, outils fintech, SaaS, applications civiques — projets livrés sur le marché africain francophone.",
  url: `${BASE}/projets`,
  author: { "@type": "Person", name: "Aboudou Zinsou", url: BASE },
  inLanguage: "fr-FR",
};

function CategoryBadge({ category }: { category: Project["category"] }) {
  const color = CATEGORY_COLORS[category];
  return (
    <span
      style={{
        fontSize: "0.6875rem",
        color,
        background: `${color}18`,
        border: `1px solid ${color}28`,
        padding: "2px 8px",
        borderRadius: "2px",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span
      style={{
        fontSize: "0.625rem",
        color: "#555",
        border: "1px solid #1e1e1e",
        padding: "2px 6px",
        borderRadius: "2px",
        letterSpacing: "0.04em",
        fontFamily: "var(--font-mono)",
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="about-project" style={{ paddingBlock: "1.5rem" }}>
      {project.screenshot && (
        <Link href={`/projets/${project.slug}`} tabIndex={-1} aria-hidden="true">
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/7",
              borderRadius: "3px",
              overflow: "hidden",
              border: "1px solid #1a1a1a",
              marginBottom: "1rem",
              background: "#0c0c0c",
            }}
          >
            <Image
              src={project.screenshot}
              alt={`Aperçu de ${project.name}`}
              fill
              style={{ objectFit: "cover", objectPosition: "top", opacity: 0.88 }}
              sizes="(max-width: 640px) 100vw, 680px"
            />
          </div>
        </Link>
      )}
      <div className="about-project__header" style={{ marginBottom: "0.625rem", flexWrap: "wrap" }}>
        <Link
          href={`/projets/${project.slug}`}
          className="about-project__name"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {project.name}
        </Link>
        <CategoryBadge category={project.category} />
        <StatusBadge status={project.status} />
        <div className="about-project__links">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="about-icon-link"
              aria-label={`Voir ${project.name}`}
            >
              <ExternalLink size={13} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="about-icon-link"
              aria-label={`GitHub — ${project.name}`}
            >
              <Github size={13} />
            </a>
          )}
          {project.npm?.map((pkg) => (
            <a
              key={pkg}
              href={`https://npmjs.com/package/${pkg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="about-npm-link"
              aria-label={`npm — ${pkg}`}
            >
              npm
            </a>
          ))}
        </div>
      </div>

      <p
        style={{
          fontSize: "var(--text-xs)",
          color: "#999",
          lineHeight: 1.5,
          marginBottom: "0.375rem",
          fontStyle: "italic",
        }}
      >
        {project.tagline}
      </p>

      <p className="about-project__desc" style={{ marginBottom: "0.875rem" }}>
        {project.description}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="about-project__stack">
          {project.stack.map((t) => (
            <StackBadge key={t} name={t} />
          ))}
        </div>
        <Link
          href={`/projets/${project.slug}`}
          style={{
            fontSize: "0.75rem",
            color: "#444",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Détails →
        </Link>
      </div>
    </div>
  );
}

const FEATURED = PROJECTS.filter((p) => p.featured);
const ALL = PROJECTS;

export default function ProjetsPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="site-container">
        <section style={{ paddingBlock: "3rem 2.5rem" }}>
          <p className="about-section-label">Portfolio</p>
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Projets livrés
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#888",
              maxWidth: "46ch",
              lineHeight: 1.85,
            }}
          >
            Marketplaces, outils fintech, SaaS, applications civiques — construits
            pour le marché africain francophone.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Sélection</p>
          <div className="about-projects">
            {FEATURED.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        <section style={{ marginBottom: "5rem" }}>
          <p className="about-section-label">Tous les projets</p>
          <div className="about-projects">
            {ALL.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>

        <footer style={{ paddingBottom: "3rem" }}>
          <Link href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
            ← Accueil
          </Link>
        </footer>
      </main>
    </>
  );
}
