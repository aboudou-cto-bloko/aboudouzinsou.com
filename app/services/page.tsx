import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { StackBadge } from "@/components/stack-badge";
import { JsonLd } from "@/components/json-ld";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Services — Aboudou Zinsou · Dev SaaS Afrique",
  description:
    "Développement SaaS pour le marché africain, intégration paiements mobile money, audit VitrinAI, IA locale. Disponible pour missions freelance depuis Cotonou, Bénin.",
  alternates: { canonical: `${BASE}/services` },
  openGraph: {
    type: "website",
    url: `${BASE}/services`,
    title: "Services — Aboudou Zinsou",
    description:
      "Développement SaaS Afrique, paiements mobile money, audit VitrinAI, IA locale. Freelance depuis Cotonou.",
  },
};

const SERVICES = [
  {
    label: "Développement SaaS",
    desc: "Conception et build complet d'applications SaaS — authentification, paiements mobile money, tableau de bord admin, déploiement Vercel. Livraison 4 à 8 semaines selon la complexité.",
    stack: ["Next.js", "Convex", "TypeScript", "Tailwind", "Vercel"],
    note: "Sur devis",
  },
  {
    label: "Intégration paiements africains",
    desc: "Moneroo, FedaPay, MTN Mobile Money, Orange Money. Webhooks sécurisés, vérification des transactions, gestion des remboursements. Aucun intermédiaire étranger — l'argent reste dans le circuit africain.",
    stack: ["Moneroo", "FedaPay", "Mobile Money", "TypeScript"],
    note: "Sur devis",
  },
  {
    label: "Audit VitrinAI",
    desc: "Score de présence digitale complet de votre PME : SEO, vitesse mobile (depuis des serveurs africains), accessibilité, avis Google, réseaux sociaux. Rapport structuré avec 5 actions prioritaires.",
    stack: ["VitrinAI", "Lighthouse", "SEO"],
    note: "Gratuit pour PMEs béninoises",
  },
  {
    label: "IA & agents locaux",
    desc: "Agents IA, RAG sur vos données internes, LLM local sans API cloud payante. Architecture supervisée avec points de contrôle humains aux étapes critiques. Zéro dépendance OpenAI.",
    stack: ["Ollama", "RAG", "Convex", "TypeScript"],
    note: "Sur devis",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Aboudou Zinsou — Dev SaaS Afrique",
  url: `${BASE}/services`,
  description: "Développement SaaS, intégration paiements mobile money, IA locale. Freelance depuis Cotonou, Bénin.",
  address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
  areaServed: ["BJ", "CI", "SN", "TG", "BF"],
  email: "pro@aboudouzinsou.com",
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="site-container">

        <section style={{ paddingBlock: "3rem 2.5rem" }}>
          <p className="about-section-label">Services</p>
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Travaillons ensemble
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#888",
              maxWidth: "46ch",
              lineHeight: 1.85,
            }}
          >
            Je conçois des SaaS pour startups et PME africaines — paiements mobile money,
            IA locale, architecture qui tient en production. Basé à Cotonou, disponible en remote.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        <section style={{ marginBottom: "3.5rem" }}>
          <div className="about-projects">
            {SERVICES.map((s) => (
              <div key={s.label} className="about-project">
                <div className="about-project__header">
                  <span className="about-project__name">{s.label}</span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "var(--text-xs)",
                      color: "#555",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.note}
                  </span>
                </div>
                <p className="about-project__desc">{s.desc}</p>
                <div className="about-project__stack">
                  {s.stack.map((t) => (
                    <StackBadge key={t} name={t} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        <section style={{ marginBottom: "5rem" }}>
          <p className="about-section-label">Contact</p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#666",
              marginBottom: "1.5rem",
              lineHeight: 1.8,
            }}
          >
            Décrivez votre projet par email. Je réponds sous 24h.
          </p>
          <a
            href="mailto:pro@aboudouzinsou.com"
            className="about-contact__item"
          >
            <Mail size={14} strokeWidth={1.5} />
            <span>pro@aboudouzinsou.com</span>
          </a>
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
