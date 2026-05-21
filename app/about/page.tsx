import type { Metadata } from "next";
import { Github, Mail, ExternalLink, Linkedin } from "lucide-react";
import { StackBadge } from "@/components/stack-badge";
import { ScrambleText } from "@/components/scramble-text";
import { JsonLd } from "@/components/json-ld";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "À propos — Aboudou Zinsou · Développeur Full-Stack SaaS · Cotonou, Bénin",
  description:
    "Développeur full-stack basé à Cotonou (Bénin), spécialisé en intégration Mobile Money (MTN, Moov), SaaS sur mesure et marketplaces pour le marché africain francophone. Fondateur de BLOKO et Pixel-Mart.",
  alternates: { canonical: `${BASE}/about` },
  openGraph: {
    type: "profile",
    url: `${BASE}/about`,
    title: "Aboudou Zinsou — Développeur Full-Stack SaaS · Cotonou, Bénin",
    description: "Développeur full-stack basé à Cotonou (Bénin), spécialisé en intégration Mobile Money (MTN, Moov), SaaS et marketplaces pour le marché africain francophone.",
  },
};

function IconFacebook() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

type ProjectProps = {
  name: string;
  description: string;
  stack: string[];
  github?: string;
  npm?: string[];
  live?: string;
};

function Project({ name, description, stack, github, npm, live }: ProjectProps) {
  return (
    <div className="about-project">
      <div className="about-project__header">
        <span className="about-project__name">{name}</span>
        <div className="about-project__links">
          {live && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="about-icon-link"
              aria-label={`Voir ${name}`}
            >
              <ExternalLink size={13} />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="about-icon-link"
              aria-label={`GitHub — ${name}`}
            >
              <Github size={13} />
            </a>
          )}
          {npm?.map((pkg) => (
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
      <p className="about-project__desc">{description}</p>
      <div className="about-project__stack">
        {stack.map((t) => (
          <StackBadge key={t} name={t} />
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aboudou Zinsou",
    alternateName: "François Mawutô Aboudou ZINSOU",
    url: BASE,
    sameAs: [
      "https://github.com/aboudou-cto-bloko",
      "https://www.linkedin.com/in/fran%C3%A7oisab8099316/",
      "https://npmjs.com/package/moneroo",
      "https://www.facebook.com/francois.SaasXpert",
    ],
    jobTitle: "Développeur Full-Stack SaaS · Mobile Money · Cotonou, Bénin",
    description: "Développeur full-stack spécialisé en intégration Mobile Money (MTN, Moov, Orange) et SaaS pour le marché africain francophone. Fondateur de BLOKO (fintech) et Pixel-Mart (marketplace). Auteur du package npm moneroo.",
    email: "pro@aboudouzinsou.com",
    address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
  };

  return (
    <>
      <JsonLd data={personJsonLd} />
    <main className="site-container">
      {/* Bio */}
      <section style={{ paddingBlock: "3rem 2.5rem" }}>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}
        >
          <ScrambleText
            text="Aboudou Zinsou"
            speed={38}
            stagger={3}
            cycles={7}
          />
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "#888", marginBottom: "0.25rem" }}>
          François Mawutô Aboudou ZINSOU
        </p>
        <p style={{ fontSize: "var(--text-sm)", color: "#aaa", maxWidth: "42ch", lineHeight: 1.9, marginTop: "1rem" }}>
          Dev full-stack SaaS. Je construis des produits numériques pour le
          marché africain francophone — paiements, marketplaces, SaaS
          d&apos;abonnement, outils métier.
        </p>
        <p style={{ fontSize: "var(--text-sm)", color: "#666", marginTop: "0.75rem" }}>
          Cotonou, Bénin.
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

      {/* Projets en production */}
      <section style={{ marginBottom: "3.5rem" }}>
        <p className="about-section-label">En production</p>

        <div className="about-projects">
          <Project
            name="Pixel-Mart"
            description="Marketplace B2C pour le marché béninois. Vente de produits numériques et physiques avec paiements mobile money intégrés."
            stack={["Next.js 15", "Convex", "Better Auth", "Moneroo", "TypeScript"]}
            live="https://pixel-mart-bj.com"
          />
          <Project
            name="BLOKO"
            description="Escrow fintech pour les transactions en ligne. Sécurise les échanges commerciaux entre acheteurs et vendeurs en Afrique francophone."
            stack={["Nx", "Next.js 14", "Supabase", "Prisma", "FedaPay", "TypeScript"]}
          />
          <Project
            name="PLR Library"
            description="SaaS d'abonnement à des ressources numériques PLR (Private Label Rights). Paiements récurrents, accès membres, gestion des licences."
            stack={["Next.js 14", "Convex", "Moneroo", "TypeScript"]}
            github="https://github.com/aboudou-cto-bloko/plr-platform"
          />
          <Project
            name="RendezApp"
            description="Prise de rendez-vous via WhatsApp. Les clients réservent depuis leur messagerie préférée, sans app à installer."
            stack={["Next.js 14", "Convex", "WhatsApp API", "TypeScript"]}
            github="https://github.com/aboudou-cto-bloko/rendez-app"
          />
          <Project
            name="Kamgoko"
            description="Dématérialisation des actes d'état civil pour la mairie de Cotonou. Gestion des naissances, mariages et décès."
            stack={["PHP 8.2", "MySQL 8"]}
            github="https://github.com/aboudou-cto-bloko/etat-civil-cotonou"
          />
        </div>
      </section>

      {/* Open source & outils */}
      <section style={{ marginBottom: "3.5rem" }}>
        <p className="about-section-label">Open source &amp; outils</p>

        <div className="about-projects">
          <Project
            name="Moneroo SDK"
            description="SDK TypeScript officieux et serveur MCP pour l'API Moneroo. Permet d'intégrer les paiements mobile money africains depuis n'importe quelle app TS ou agent IA."
            stack={["TypeScript", "Node.js", "MCP"]}
            github="https://github.com/aboudou-cto-bloko/moneroo-tools"
            npm={["moneroo", "moneroo-mcp"]}
          />
          <Project
            name="VitrinAI"
            description="Diagnostic de la présence digitale des PME ouest-africaines. Mesure les performances depuis des serveurs africains, pas parisiens."
            stack={["Next.js", "Convex", "TypeScript"]}
            github="https://github.com/aboudou-cto-bloko/vitrinai"
          />
          <Project
            name="WIBN"
            description="What Is Broken Now — extraction et analyse d'idées SaaS depuis les signaux de douleur publics sur Reddit, via IA."
            stack={["Next.js", "Groq", "Inngest", "TypeScript"]}
            github="https://github.com/aboudou-cto-bloko/wibn"
          />
          <Project
            name="MVP Mapper"
            description="Outil de structuration et de priorisation de MVP. Aide à décider quoi construire en premier."
            stack={["Next.js", "TypeScript"]}
            github="https://github.com/aboudou-cto-bloko/mvp-mapper"
          />
          <Project
            name="MoMo Gate"
            description="Passerelle de paiement mobile money unifiée. Abstraction sur les APIs MTN, Moov et autres opérateurs africains."
            stack={["Node.js", "TypeScript"]}
            github="https://github.com/aboudou-cto-bloko/momo-gate"
          />
        </div>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

      {/* Contact */}
      <section style={{ marginBottom: "5rem" }}>
        <p className="about-section-label">Contact</p>

        <div className="about-contact">
          <a
            href="mailto:pro@aboudouzinsou.com"
            className="about-contact__item"
          >
            <Mail size={14} strokeWidth={1.5} />
            <span>pro@aboudouzinsou.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/fran%C3%A7oisab8099316/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-contact__item"
          >
            <Linkedin size={14} strokeWidth={1.5} />
            <span>linkedin.com/in/françoisab8099316</span>
          </a>
          <a
            href="https://github.com/aboudou-cto-bloko"
            target="_blank"
            rel="noopener noreferrer"
            className="about-contact__item"
          >
            <Github size={14} strokeWidth={1.5} />
            <span>github.com/aboudou-cto-bloko</span>
          </a>
          <a
            href="https://www.facebook.com/francois.SaasXpert"
            target="_blank"
            rel="noopener noreferrer"
            className="about-contact__item"
          >
            <IconFacebook />
            <span>SaasXpert</span>
          </a>
          <a
            href="https://wa.me/2290147876843"
            target="_blank"
            rel="noopener noreferrer"
            className="about-contact__item"
          >
            <IconWhatsApp />
            <span>+229 01 47 87 68 43</span>
          </a>
        </div>
      </section>

      <footer style={{ paddingBottom: "3rem" }}>
        <a href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
          ← Accueil
        </a>
      </footer>
    </main>
    </>
  );
}
