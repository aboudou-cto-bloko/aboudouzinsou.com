import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, Github, Mail } from "lucide-react";
import { StackBadge } from "@/components/stack-badge";
import { JsonLd } from "@/components/json-ld";
import {
  PROJECTS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  STATUS_LABELS,
  getProjectBySlug,
  type Project,
} from "@/lib/projects";
import type { Metadata } from "next";

const BASE = "https://aboudouzinsou.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const url = `${BASE}/projets/${slug}`;
  const cp = new URLSearchParams({ t: `${project.name} — ${project.tagline}`, s: "projets" });
  const coverUrl = `${BASE}/api/cover?${cp.toString()}`;
  return {
    title: `${project.name} — Aboudou Zinsou`,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${project.name} — ${project.tagline}`,
      description: project.description,
      images: [{ url: coverUrl, width: 1200, height: 630, alt: `${project.name} — ${project.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — ${project.tagline}`,
      description: project.description,
      images: [coverUrl],
    },
  };
}

function CategoryBadge({ project }: { project: Project }) {
  const color = CATEGORY_COLORS[project.category];
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
      }}
    >
      {CATEGORY_LABELS[project.category]}
    </span>
  );
}

function StatusBadge({ project }: { project: Project }) {
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
      }}
    >
      {STATUS_LABELS[project.status]}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.6875rem",
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </p>
  );
}

function Prose({ children }: { children: string }) {
  return (
    <p
      style={{
        fontSize: "var(--text-xs)",
        color: "#777",
        lineHeight: 1.85,
        maxWidth: "58ch",
      }}
    >
      {children}
    </p>
  );
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: `${BASE}/projets/${slug}`,
    author: { "@type": "Person", name: "Aboudou Zinsou", url: BASE },
    applicationCategory: CATEGORY_LABELS[project.category],
    inLanguage: "fr-FR",
    ...(project.live ? { sameAs: project.live } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
      { "@type": "ListItem", position: 2, name: "Projets", item: `${BASE}/projets` },
      { "@type": "ListItem", position: 3, name: project.name, item: `${BASE}/projets/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={projectJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <main className="site-container">
        {/* ── Header ── */}
        <section style={{ paddingBlock: "3rem 2.5rem" }}>
          <Link
            href="/projets"
            style={{ fontSize: "0.75rem", color: "#444", display: "inline-block", marginBottom: "1.75rem" }}
          >
            ← Projets
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <CategoryBadge project={project} />
            <StatusBadge project={project} />
          </div>

          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: "0.875rem",
            }}
          >
            {project.name}
          </h1>

          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#888",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
              maxWidth: "48ch",
              fontStyle: "italic",
            }}
          >
            {project.tagline}
          </p>

          <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexWrap: "wrap" }}>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-cta profile-cta--primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "var(--text-xs)" }}
              >
                <ExternalLink size={12} />
                Voir le projet
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact__item"
              >
                <Github size={13} strokeWidth={1.5} />
                <span>GitHub</span>
              </a>
            )}
            {project.npm?.map((pkg) => (
              <a
                key={pkg}
                href={`https://npmjs.com/package/${pkg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="about-npm-link"
                style={{ fontSize: "0.75rem" }}
              >
                npm · {pkg}
              </a>
            ))}
          </div>
        </section>

        {project.screenshot && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/7",
              borderRadius: "3px",
              overflow: "hidden",
              border: "1px solid #1e1e1e",
              marginBottom: "2.5rem",
              background: "#0c0c0c",
            }}
          >
            <Image
              src={project.screenshot}
              alt={`Aperçu de ${project.name}`}
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              sizes="(max-width: 640px) 100vw, 680px"
              priority
            />
          </div>
        )}

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Description ── */}
        <section style={{ marginBottom: "3rem" }}>
          <Prose>{project.description}</Prose>
        </section>

        {/* ── Problème ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <SectionLabel>Le problème</SectionLabel>
          <Prose>{project.problem}</Prose>
        </section>

        {/* ── Solution ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <SectionLabel>Ce qui a été construit</SectionLabel>
          <Prose>{project.solution}</Prose>
        </section>

        {/* ── Impact ── */}
        {project.impact && (
          <section style={{ marginBottom: "2.5rem" }}>
            <SectionLabel>Impact</SectionLabel>
            <Prose>{project.impact}</Prose>
          </section>
        )}

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "2.5rem" }} />

        {/* ── Stack ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <SectionLabel>Stack technique</SectionLabel>
          <div className="about-project__stack">
            {project.stack.map((t) => (
              <StackBadge key={t} name={t} />
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── CTA ── */}
        <section style={{ marginBottom: "5rem" }}>
          <p className="about-section-label">Projet similaire ?</p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#666",
              marginBottom: "1.5rem",
              lineHeight: 1.8,
              maxWidth: "44ch",
            }}
          >
            Décrivez votre projet en quelques lignes. Je réponds sous 24h avec
            une estimation de délai et de budget.
          </p>
          <a
            href={`mailto:pro@aboudouzinsou.com?subject=Projet similaire à ${encodeURIComponent(project.name)}`}
            className="about-contact__item"
          >
            <Mail size={14} strokeWidth={1.5} />
            <span>pro@aboudouzinsou.com</span>
          </a>
        </section>

        <footer style={{ paddingBottom: "3rem", display: "flex", gap: "1.5rem" }}>
          <Link href="/projets" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
            ← Tous les projets
          </Link>
          <Link href="/services" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
            Services →
          </Link>
        </footer>
      </main>
    </>
  );
}
