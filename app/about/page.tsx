import type { Metadata } from "next";
import { Github, Mail, ExternalLink, Linkedin } from "lucide-react";
import { StackBadge } from "@/components/stack-badge";

export const metadata: Metadata = {
  title: "À propos — Aboudou Zinsou",
  description:
    "Dev full-stack SaaS, marché africain francophone. Je construis des produits numériques pour l'Afrique.",
};

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
  return (
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
          François Mawutô<br />Aboudou Zinsou
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "#aaa", maxWidth: "42ch", lineHeight: 1.9 }}>
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
            href="mailto:aboudouzinsou@yahoo.com"
            className="about-contact__item"
          >
            <Mail size={14} strokeWidth={1.5} />
            <span>aboudouzinsou@yahoo.com</span>
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
        </div>
      </section>

      <footer style={{ paddingBottom: "3rem" }}>
        <a href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>
          ← Accueil
        </a>
      </footer>
    </main>
  );
}
