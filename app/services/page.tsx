import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { JsonLd } from "@/components/json-ld";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Services — Développement SaaS & Paiements Africains | Aboudou Zinsou",
  description:
    "Je construis la mémoire et l'intelligence opérationnelle des PME africaines : base de connaissances vivante, agents IA sur vos workflows, tableau de bord de pilotage. Aussi : intégration Mobile Money, SaaS sur mesure.",
  alternates: { canonical: `${BASE}/services` },
  openGraph: {
    type: "website",
    url: `${BASE}/services`,
    title: "Intelligence d'entreprise & SaaS Afrique — Aboudou Zinsou, Cotonou",
    description:
      "Base de connaissances vivante, agents IA métiers, tableau de bord de pilotage — pour les PME qui veulent arrêter d'oublier.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE}/services`,
  name: "Aboudou Zinsou — Intelligence d'entreprise · SaaS · Paiements Africains",
  url: `${BASE}/services`,
  email: "pro@aboudouzinsou.com",
  description:
    "Je construis la mémoire et l'intelligence opérationnelle des PME africaines : base de connaissances vivante, agents IA sur les workflows, tableau de bord de pilotage. Aussi : intégration Mobile Money, SaaS sur mesure.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    addressCountry: "BJ",
  },
  areaServed: ["BJ", "CI", "SN", "TG", "BF", "GN", "ML"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Intelligence d'entreprise — Mémoire, Agents, Pilotage",
          description:
            "Construction de la mémoire opérationnelle d'une PME : base de connaissances structurée alimentée automatiquement depuis WhatsApp, agents IA sur les workflows clés, tableau de bord temps réel. Données hébergées localement.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Site web & E-commerce",
          description:
            "Landing page, site vitrine ou e-commerce avec paiement Mobile Money (MTN, Moov). Livré avec code source, hébergement Vercel et SEO local.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Intégration Paiements Africains",
          description:
            "Intégration FedaPay, Moneroo, MTN Mobile Money, Orange Money. Webhooks sécurisés, remboursements, conformité XOF.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Développement SaaS sur mesure",
          description:
            "Applications SaaS pour le marché africain francophone. Next.js, Convex, TypeScript, mobile-first.",
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
    label: "Site web & E-commerce",
    badge: "Le plus demandé",
    tagline: "Landing page, site vitrine ou e-commerce — avec Mobile Money dès le départ.",
    desc: "Site conçu pour convertir : mobile-first, SEO local Cotonou, paiement MTN/Moov intégré si besoin. Code source livré, hébergement sur votre compte — vous êtes propriétaire, pas locataire.",
    deliver: "Landing page 1-2 sem · Vitrine 2-4 sem · E-commerce 4-8 sem",
    note: "150K – 1,5M XOF selon le projet",
  },
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

        {/* ── Service phare ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: "4px",
              padding: "2rem",
              background: "#0a0a0a",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-primary)", letterSpacing: "-0.01em" }}>
                Intelligence d&apos;entreprise
              </span>
              <span style={{ fontSize: "0.6875rem", color: "#c8a86b", background: "#c8a86b18", border: "1px solid #c8a86b22", padding: "2px 8px", borderRadius: "2px", letterSpacing: "0.04em" }}>
                Service phare
              </span>
            </div>

            <p style={{ fontSize: "var(--text-sm)", color: "#aaa", fontStyle: "italic", lineHeight: 1.55, marginBottom: "1rem" }}>
              Votre entreprise oublie tout. Chaque soir.
            </p>

            <p style={{ fontSize: "var(--text-xs)", color: "#666", lineHeight: 1.9, marginBottom: "1.5rem", maxWidth: "56ch" }}>
              Les décisions prises en réunion disparaissent. Les numéros de clients se perdent entre deux téléphones. L&apos;employé qui part emporte trois ans de connaissance avec lui. WhatsApp est le système nerveux de votre entreprise — mais WhatsApp n&apos;a pas de mémoire.
            </p>

            <p style={{ fontSize: "var(--text-xs)", color: "#666", lineHeight: 1.9, marginBottom: "1.5rem", maxWidth: "56ch" }}>
              Je construis la mémoire qui manque. Une base de connaissances vivante, alimentée automatiquement depuis vos sources existantes. Des agents qui lisent cette base, exécutent vos workflows, et écrivent ce qu&apos;ils ont fait. Un tableau de bord pour piloter le tout en temps réel.
            </p>

            <p style={{ fontSize: "var(--text-xs)", color: "#555", lineHeight: 1.9, marginBottom: "1.75rem", maxWidth: "56ch" }}>
              Données hébergées chez vous. Aucune dépendance cloud obligatoire. Conçu pour fonctionner sur une connexion 3G et avec une équipe qui travaille sur WhatsApp — pas sur Notion.
            </p>

            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <a
                href={`mailto:pro@aboudouzinsou.com?subject=Diagnostic gratuit — intelligence d'entreprise&body=${encodeURIComponent("Bonjour,\n\nJe souhaite un diagnostic gratuit de la mémoire de mon entreprise.\n\nNom de l'entreprise : \nSecteur : \nNombre d'employés : \nPrincipal problème d'information : ")}`}
                className="profile-cta profile-cta--primary"
                style={{ display: "inline-flex" }}
              >
                Demander un diagnostic gratuit
              </a>
              <span style={{ fontSize: "0.75rem", color: "#444", fontFamily: "var(--font-mono)" }}>
                6 à 14 semaines · Sur devis
              </span>
            </div>
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Autres services ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label" style={{ marginBottom: "1.75rem" }}>Également</p>
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
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a
              href="mailto:pro@aboudouzinsou.com"
              className="about-contact__item"
            >
              <Mail size={14} strokeWidth={1.5} />
              <span>pro@aboudouzinsou.com</span>
            </a>
            <a
              href="https://wa.me/2290167266360?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20mon%20projet."
              target="_blank"
              rel="noopener noreferrer"
              className="about-contact__item"
            >
              <span>WhatsApp — +229 01 67 26 63 60</span>
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
