import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { JsonLd } from "@/components/json-ld";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Intégration Mobile Money · SaaS Afrique · Freelance Cotonou | Aboudou Zinsou",
  description:
    "Développeur freelance à Cotonou, Bénin. Intégration FedaPay, MTN Mobile Money, Moneroo, Orange Money. Développement SaaS sur mesure pour le marché africain francophone. Audit VitrinAI gratuit.",
  alternates: { canonical: `${BASE}/services` },
  keywords: [
    "développeur freelance Bénin",
    "développeur freelance Cotonou",
    "intégration FedaPay",
    "intégration Mobile Money",
    "Moneroo développeur",
    "SaaS Afrique de l'Ouest",
    "développement application web Bénin",
    "développeur TypeScript Afrique",
    "intégration paiements africains",
    "MTN Mobile Money intégration",
  ],
  openGraph: {
    type: "website",
    url: `${BASE}/services`,
    title: "Intégration Mobile Money & SaaS Afrique — Développeur Freelance Cotonou",
    description:
      "Développeur freelance à Cotonou. FedaPay, MTN Mobile Money, Moneroo. SaaS sur mesure pour le marché africain.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE}/services`,
  name: "Aboudou Zinsou — Développeur Freelance SaaS & Paiements Africains",
  url: `${BASE}/services`,
  email: "pro@aboudouzinsou.com",
  description:
    "Développeur freelance basé à Cotonou, Bénin. Spécialisé intégration FedaPay, Moneroo, MTN Mobile Money, Orange Money. Développement SaaS Next.js pour le marché africain francophone.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    addressCountry: "BJ",
  },
  areaServed: ["BJ", "CI", "SN", "TG", "BF", "GN", "ML"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services de développement",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Intégration Paiements Africains",
          description:
            "Intégration FedaPay, Moneroo, MTN Mobile Money, Orange Money pour applications web et SaaS. Webhooks sécurisés, remboursements, conformité XOF.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Développement SaaS sur mesure",
          description:
            "Conception et développement d'applications SaaS pour le marché africain francophone. Next.js, Convex, TypeScript.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Agents IA & Automatisation Locale",
          description:
            "Agents IA locaux, RAG sur données internes, LLM local sans dépendance OpenAI.",
        },
      },
    ],
  },
};

type Service = {
  label: string;
  badge?: string;
  tagline: string;
  desc: string;
  deliver: string;
  note: string;
};

const SERVICES: Service[] = [
  {
    label: "Intégration Paiements Africains",
    badge: "Expertise principale",
    tagline:
      "Vos clients paient avec leur téléphone — pas avec une carte Visa qu'ils n'ont pas.",
    desc: "FedaPay, Moneroo, MTN Mobile Money, Orange Money. Je gère les webhooks, la vérification de transaction, les remboursements et les règles XOF. Zéro commission étrangère — l'argent reste dans le circuit africain. Votre application accepte les paiements locaux dès la mise en ligne.",
    deliver: "Livré en 2 à 3 semaines · Documentation incluse · Tests en environnement réel",
    note: "Sur devis selon la complexité",
  },
  {
    label: "Développement SaaS sur mesure",
    tagline: "De la page de vente au tableau de bord admin — livré en 4 à 8 semaines.",
    desc: "Authentification, paiements Mobile Money intégrés dès le départ, interface mobile-first, analytics. Stack éprouvée sur le marché africain : Next.js, Convex, TypeScript. Votre SaaS fonctionne sur une connexion 3G africaine — pas seulement sur la fibre parisienne.",
    deliver: "Livré en 4 à 8 semaines · Déploiement Vercel · Source code inclus",
    note: "Sur devis selon les fonctionnalités",
  },
  {
    label: "Agents IA & Automatisation Locale",
    tagline:
      "Un système qui travaille pour vous — sans envoyer vos données à San Francisco.",
    desc: "Prospection automatisée, assistant sur vos documents internes, analyse de données clients. LLM local sur votre infrastructure : zéro coût API mensuel, zéro dépendance OpenAI. L'agent génère, vous validez, il exécute — supervisé à chaque étape critique.",
    deliver: "Livré en 3 à 6 semaines · LLM local · Données hébergées chez vous",
    note: "Sur devis selon le périmètre",
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="site-container">

        {/* ── Hero ── */}
        <section style={{ paddingBlock: "3rem 2.5rem" }}>
          <p className="about-section-label">Freelance · Cotonou, Bénin</p>
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            Développement SaaS
            <br />& Paiements Africains
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#888",
              maxWidth: "46ch",
              lineHeight: 1.85,
            }}
          >
            Je construis des produits numériques qui fonctionnent réellement sur le
            marché africain — paiements mobile money natifs, interfaces mobiles-first,
            IA sans dépendance cloud.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Services ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div className="about-projects">
            {SERVICES.map((s) => (
              <div key={s.label} className="about-project">

                {/* En-tête */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 500,
                      color: "var(--color-primary)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.label}
                  </span>
                  {s.badge && (
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "#c8a86b",
                        background: "#c8a86b18",
                        border: "1px solid #c8a86b22",
                        padding: "2px 8px",
                        borderRadius: "2px",
                        letterSpacing: "0.04em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.badge}
                    </span>
                  )}
                </div>

                {/* Tagline */}
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "#aaa",
                    lineHeight: 1.55,
                    marginBottom: "0.625rem",
                    fontStyle: "italic",
                  }}
                >
                  {s.tagline}
                </p>

                {/* Description */}
                <p className="about-project__desc" style={{ marginBottom: "0.875rem" }}>
                  {s.desc}
                </p>

                {/* Livraison + tarif */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#555",
                      fontFamily: "var(--font-mono)",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.deliver}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#444",
                      fontFamily: "var(--font-mono)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {s.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tunnel VitrinAI ── */}
        <section
          style={{
            marginBottom: "3.5rem",
            padding: "1.75rem",
            border: "1px solid #1e1e1e",
            borderRadius: "4px",
            background: "#0c0c0c",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.875rem",
            }}
          >
            Audit gratuit
          </p>
          <h2
            style={{
              fontSize: "var(--text-base)",
              fontWeight: 500,
              letterSpacing: "-0.015em",
              color: "var(--color-primary)",
              marginBottom: "0.75rem",
              lineHeight: 1.35,
            }}
          >
            Vous ne savez pas par où commencer ?
            <br />
            Commencez par voir ce qui cloche.
          </h2>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "#666",
              lineHeight: 1.8,
              maxWidth: "50ch",
              marginBottom: "1.25rem",
            }}
          >
            VitrinAI mesure en 30 secondes ce que Google voit de votre site :
            visibilité SEO, vitesse sur 4G africaine, accessibilité mobile,
            présence Maps. Résultat : un score sur 100 et 5 actions prioritaires.
            <br /><br />
            Si vous voulez corriger — c&apos;est exactement ce que je fais.
          </p>
          <a
            href={`mailto:pro@aboudouzinsou.com?subject=Audit VitrinAI gratuit — ${encodeURIComponent("mon site")}&body=${encodeURIComponent("Bonjour,\n\nJe souhaite un audit VitrinAI gratuit de mon site.\n\nURL : \nNom de l'entreprise : ")}`}
            className="profile-cta profile-cta--primary"
            style={{ display: "inline-flex" }}
          >
            Demander l&apos;audit gratuit
          </a>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Contact ── */}
        <section style={{ marginBottom: "5rem" }}>
          <p className="about-section-label">Démarrer un projet</p>
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
