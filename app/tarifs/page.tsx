import Link from "next/link";
import { Mail } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Prix site web au Bénin — Tarifs clairs, Mobile Money | Aboudou Zinsou",
  description:
    "Prix d'un site web au Bénin en 2026 : landing page à partir de 150 000 XOF, site vitrine 300 000–600 000 XOF, e-commerce 500 000–1 500 000 XOF. Développeur freelance basé à Cotonou.",
  alternates: { canonical: `${BASE}/tarifs` },
  openGraph: {
    type: "website",
    url: `${BASE}/tarifs`,
    title: "Tarifs — Création site web & application au Bénin | Aboudou Zinsou",
    description:
      "Combien coûte un site web au Bénin ? Landing page, site vitrine, e-commerce, application SaaS — tarifs clairs, délais réels, Mobile Money accepté.",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Person", "LocalBusiness"],
  "@id": BASE,
  name: "Aboudou Zinsou — Développeur Web Freelance Bénin",
  url: BASE,
  email: "pro@aboudouzinsou.com",
  telephone: "+22901478768",
  description:
    "Développeur full-stack freelance basé à Cotonou, Bénin. Création de sites web, applications SaaS et intégration Mobile Money pour le marché africain francophone.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cotonou",
    addressLocality: "Cotonou",
    addressRegion: "Littoral",
    addressCountry: "BJ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 6.3654,
    longitude: 2.4183,
  },
  areaServed: [
    { "@type": "Country", name: "Bénin" },
    { "@type": "Country", name: "Côte d'Ivoire" },
    { "@type": "Country", name: "Sénégal" },
    { "@type": "Country", name: "Togo" },
  ],
  priceRange: "150 000 XOF – 4 000 000 XOF",
  currenciesAccepted: "XOF",
  paymentAccepted: "MTN Mobile Money, Orange Money, virement bancaire",
  openingHours: "Mo-Fr 08:00-18:00",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Prestations web — Bénin",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Landing page",
        description: "Page unique de présentation ou de conversion, mobile-first, SEO de base.",
        price: "150000",
        priceCurrency: "XOF",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "150000",
          maxPrice: "300000",
          priceCurrency: "XOF",
        },
      },
      {
        "@type": "Offer",
        name: "Site vitrine",
        description: "3 à 8 pages, formulaire de contact, SEO local, hébergement Vercel.",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "300000",
          maxPrice: "600000",
          priceCurrency: "XOF",
        },
      },
      {
        "@type": "Offer",
        name: "Site e-commerce",
        description: "Catalogue produits, paiement Mobile Money intégré, tableau de bord vendeur.",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "500000",
          maxPrice: "1500000",
          priceCurrency: "XOF",
        },
      },
      {
        "@type": "Offer",
        name: "Application SaaS",
        description: "Application web sur mesure avec authentification, paiements récurrents, tableau de bord.",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: "1500000",
          priceCurrency: "XOF",
        },
      },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien coûte un site web au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le prix d'un site web au Bénin dépend du type de projet. Une landing page coûte entre 150 000 et 300 000 XOF. Un site vitrine entre 300 000 et 600 000 XOF. Un site e-commerce entre 500 000 et 1 500 000 XOF. Une application web SaaS débute à 1 500 000 XOF selon les fonctionnalités.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte une landing page au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une landing page au Bénin coûte entre 150 000 et 300 000 XOF. Elle comprend une page unique mobile-first, un design sur mesure, un formulaire de contact et un référencement SEO de base. Délai de livraison : 1 à 2 semaines.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le prix d'un site e-commerce au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un site e-commerce au Bénin coûte entre 500 000 et 1 500 000 XOF. Ce tarif inclut le catalogue produits, le panier, le paiement Mobile Money (MTN, Moov) et un tableau de bord de gestion des commandes. Délai : 4 à 8 semaines.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte l'intégration du paiement Mobile Money sur un site ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'intégration du paiement Mobile Money (MTN, Moov, Orange Money) sur un site existant coûte entre 150 000 et 400 000 XOF selon la complexité. Cela inclut les webhooks de confirmation, la gestion des remboursements et les tests en environnement réel.",
      },
    },
    {
      "@type": "Question",
      name: "Quel est le délai pour créer un site web au Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les délais varient selon le projet : 1 à 2 semaines pour une landing page, 2 à 4 semaines pour un site vitrine, 4 à 8 semaines pour un e-commerce, et 8 à 16 semaines pour une application SaaS complète.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il payer la totalité avant le début du projet ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. La facturation se fait en deux temps : 40 % à la signature pour démarrer le projet, 60 % à la livraison finale après validation. Pour les projets longs (SaaS), un échelonnement mensuel est possible.",
      },
    },
    {
      "@type": "Question",
      name: "Proposez-vous la maintenance après livraison ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Une maintenance de 3 mois est incluse dans chaque projet — corrections de bugs, mises à jour de sécurité. Au-delà, un contrat de maintenance mensuel est disponible à partir de 50 000 XOF/mois selon le niveau de support.",
      },
    },
    {
      "@type": "Question",
      name: "Quels modes de paiement acceptez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "J'accepte le paiement par MTN Mobile Money, Orange Money et virement bancaire. Pas besoin de carte Visa ou de compte PayPal.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je avoir un devis personnalisé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Envoyez un email à pro@aboudouzinsou.com en décrivant votre projet. Je réponds sous 24h avec une estimation de délai et de budget, sans engagement.",
      },
    },
    {
      "@type": "Question",
      name: "Travaillez-vous avec des clients hors du Bénin ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Je travaille avec des clients au Bénin, en Côte d'Ivoire, au Sénégal, au Togo et en diaspora. Tout se passe à distance — appel vidéo, email, WhatsApp.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: BASE },
    { "@type": "ListItem", position: 2, name: "Tarifs", item: `${BASE}/tarifs` },
  ],
};

type Tier = {
  name: string;
  range: string;
  unit: string;
  delay: string;
  desc: string;
  includes: string[];
  highlight?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Landing page",
    range: "150 000 – 300 000",
    unit: "XOF",
    delay: "1 – 2 semaines",
    desc: "Une page unique pensée pour convertir. Idéale pour lancer une offre, tester un marché ou accompagner une campagne publicitaire.",
    includes: [
      "Design sur mesure, mobile-first",
      "Formulaire de contact ou CTA",
      "SEO de base (balises, vitesse, sitemap)",
      "Hébergement Vercel inclus 1 an",
      "Nom de domaine conseillé",
    ],
  },
  {
    name: "Site vitrine",
    range: "300 000 – 600 000",
    unit: "XOF",
    delay: "2 – 4 semaines",
    desc: "Votre vitrine professionnelle en ligne. 3 à 8 pages, bien référencée localement, visible sur Google Maps et optimisée pour les recherches depuis un téléphone.",
    includes: [
      "3 à 8 pages (accueil, services, à propos, contact…)",
      "SEO local Cotonou / Bénin",
      "Formulaire de contact fonctionnel",
      "Google Maps intégré",
      "Hébergement Vercel inclus 1 an",
      "Formation à la mise à jour (1h)",
    ],
    highlight: true,
  },
  {
    name: "Site e-commerce",
    range: "500 000 – 1 500 000",
    unit: "XOF",
    delay: "4 – 8 semaines",
    desc: "Votre boutique en ligne avec paiement Mobile Money natif. Vos clients achètent depuis leur téléphone avec MTN ou Moov — sans carte bancaire.",
    includes: [
      "Catalogue produits illimité",
      "Paiement MTN Mobile Money + Moov intégré",
      "Tableau de bord gestion des commandes",
      "Gestion des stocks",
      "Emails de confirmation automatiques",
      "Hébergement Vercel inclus 1 an",
    ],
  },
  {
    name: "Application SaaS",
    range: "1 500 000+",
    unit: "XOF",
    delay: "8 – 16 semaines",
    desc: "Une application web complète avec authentification, abonnements, tableau de bord et base de données temps réel. Pensée pour durer et scaler.",
    includes: [
      "Authentification (email, Google, téléphone)",
      "Paiements récurrents Mobile Money",
      "Base de données temps réel (Convex)",
      "Tableau de bord admin",
      "API documentée",
      "Déploiement et CI/CD inclus",
    ],
  },
];

const EXTRAS = [
  { name: "Intégration Mobile Money", price: "150 000 – 400 000 XOF", desc: "Ajout MTN / Moov / Orange Money sur un site existant. Webhooks, confirmations, remboursements." },
  { name: "Refonte de site existant", price: "200 000 – 500 000 XOF", desc: "Redesign complet d'un site existant — nouveau design, vitesse, SEO, sans repartir de zéro sur le contenu." },
  { name: "Maintenance mensuelle", price: "À partir de 50 000 XOF/mois", desc: "Mises à jour, corrections de bugs, surveillance uptime, sauvegardes hebdomadaires." },
  { name: "Audit de site", price: "75 000 XOF", desc: "Rapport complet : SEO, vitesse, accessibilité, mobile, sécurité. 5 actions prioritaires livrées sous 48h." },
];

const FAQ_ITEMS = [
  {
    q: "Combien coûte un site web au Bénin ?",
    a: "Entre 150 000 et 1 500 000 XOF selon le type de projet. Une landing page commence à 150 000 XOF, un site vitrine entre 300 000 et 600 000 XOF, un e-commerce entre 500 000 et 1 500 000 XOF. Ces tarifs incluent le design, le développement et l'hébergement la première année.",
  },
  {
    q: "Faut-il payer en entier avant le début ?",
    a: "Non. 40 % à la signature pour lancer le projet, 60 % à la livraison finale après votre validation. Pour les projets longs (SaaS), un échelonnement mensuel est possible.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "MTN Mobile Money, Orange Money et virement bancaire. Pas besoin de carte Visa ni de compte PayPal.",
  },
  {
    q: "Quelle est la différence entre un site vitrine et un e-commerce ?",
    a: "Un site vitrine présente votre activité et génère des contacts (appels, emails). Un e-commerce permet à vos clients d'acheter directement en ligne et de payer par Mobile Money — vous gérez les commandes depuis un tableau de bord.",
  },
  {
    q: "La maintenance après livraison est-elle incluse ?",
    a: "Oui — 3 mois de maintenance sont inclus dans chaque projet : corrections de bugs et mises à jour de sécurité. Au-delà, un contrat mensuel est disponible à partir de 50 000 XOF/mois.",
  },
  {
    q: "Combien de temps pour créer mon site ?",
    a: "1 à 2 semaines pour une landing page, 2 à 4 semaines pour un site vitrine, 4 à 8 semaines pour un e-commerce. Ces délais démarrent dès réception du contenu (textes, logos, photos).",
  },
  {
    q: "Travaillez-vous avec des clients hors du Bénin ?",
    a: "Oui — clients en Côte d'Ivoire, Sénégal, Togo et diaspora. Tout se passe à distance : appel WhatsApp ou Zoom, partage de maquettes en ligne, livraison par lien.",
  },
  {
    q: "Mon site sera-t-il visible sur Google ?",
    a: "Oui. Chaque projet inclut un SEO de base : balises title/meta optimisées pour votre secteur et votre ville, sitemap soumis à Google Search Console, vitesse optimisée pour la 4G africaine.",
  },
];

export default function TarifsPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
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
            Combien coûte un site web
            <br />au Bénin ?
          </h1>
          <p style={{ fontSize: "var(--text-sm)", color: "#888", maxWidth: "46ch", lineHeight: 1.85 }}>
            Des tarifs clairs, des délais réels, Mobile Money accepté.
            Développeur full-stack basé à Cotonou — pas d&apos;intermédiaire,
            pas de surprise sur la facture.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Grille tarifs ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Prestations</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                style={{
                  paddingBlock: "1.75rem",
                  borderBottom: "1px solid #1a1a1a",
                  ...(tier.highlight
                    ? { borderLeft: "2px solid #c8a86b", paddingLeft: "1.25rem", marginLeft: "-1.25rem" }
                    : {}),
                }}
              >
                {/* Nom + badge populaire */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--color-primary)", letterSpacing: "-0.01em" }}>
                    {tier.name}
                  </span>
                  {tier.highlight && (
                    <span style={{ fontSize: "0.6rem", color: "#c8a86b", background: "#c8a86b18", border: "1px solid #c8a86b28", padding: "2px 7px", borderRadius: "2px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Le plus demandé
                    </span>
                  )}
                </div>

                {/* Prix */}
                <p style={{ fontSize: "var(--text-base, 1rem)", fontWeight: 500, color: "var(--color-primary)", letterSpacing: "-0.01em", marginBottom: "0.125rem", fontFamily: "var(--font-mono)" }}>
                  {tier.range}{" "}
                  <span style={{ fontSize: "var(--text-xs)", color: "#555", fontWeight: 400 }}>{tier.unit}</span>
                </p>

                {/* Délai */}
                <p style={{ fontSize: "0.75rem", color: "#444", fontFamily: "var(--font-mono)", marginBottom: "0.875rem" }}>
                  {tier.delay}
                </p>

                {/* Description */}
                <p style={{ fontSize: "var(--text-xs)", color: "#666", lineHeight: 1.8, maxWidth: "52ch", marginBottom: "1rem" }}>
                  {tier.desc}
                </p>

                {/* Inclus */}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {tier.includes.map((item) => (
                    <li key={item} style={{ fontSize: "var(--text-xs)", color: "#555", display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <span style={{ color: "#333", flexShrink: 0 }}>–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Prestations à la carte ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">À la carte</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {EXTRAS.map((extra) => (
              <div
                key={extra.name}
                style={{ paddingBlock: "1.25rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <p style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-primary)", marginBottom: "0.25rem" }}>
                    {extra.name}
                  </p>
                  <p style={{ fontSize: "var(--text-xs)", color: "#555", lineHeight: 1.7 }}>
                    {extra.desc}
                  </p>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", flexShrink: 0, paddingTop: "0.1rem" }}>
                  {extra.price}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── Ce qui est toujours inclus ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Toujours inclus</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              ["Mobile-first", "Votre site fonctionne sur les téléphones de vos clients — pas seulement sur les MacBook Pro."],
              ["Vitesse 4G africaine", "Optimisé pour les connexions réelles au Bénin, pas seulement sur fibre parisienne."],
              ["Hébergement Vercel", "Hébergement mondial inclus la première année. Aucune coupure, zéro configuration serveur."],
              ["Code source livré", "Vous êtes propriétaire de votre site. Le code vous appartient — pas de dépendance à mon agence."],
              ["3 mois de maintenance", "Corrections de bugs et mises à jour de sécurité pendant 3 mois après la livraison."],
              ["Facturation XOF", "Pas de conversion EUR/USD. La facture est en francs CFA, payable par Mobile Money."],
            ].map(([title, desc]) => (
              <div key={title} style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1rem" }}>
                <p style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "#aaa", marginBottom: "0.375rem" }}>{title}</p>
                <p style={{ fontSize: "var(--text-xs)", color: "#555", lineHeight: 1.75 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── FAQ ── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Questions fréquentes</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} style={{ paddingBlock: "1.25rem", borderBottom: "1px solid #1a1a1a" }}>
                <p style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "#aaa", marginBottom: "0.5rem", lineHeight: 1.5 }}>
                  {q}
                </p>
                <p style={{ fontSize: "var(--text-xs)", color: "#555", lineHeight: 1.8, maxWidth: "58ch" }}>
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginBottom: "3rem" }} />

        {/* ── CTA ── */}
        <section style={{ marginBottom: "5rem" }}>
          <p className="about-section-label">Demander un devis</p>
          <p style={{ fontSize: "var(--text-sm)", color: "#666", marginBottom: "1.5rem", lineHeight: 1.8, maxWidth: "44ch" }}>
            Décrivez votre projet en quelques lignes — type de site, secteur,
            fonctionnalités souhaitées. Je réponds sous 24h avec une estimation
            de délai et de budget, sans engagement.
          </p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <a
              href={`mailto:pro@aboudouzinsou.com?subject=Devis — création site web&body=${encodeURIComponent("Bonjour,\n\nJe souhaite un devis pour :\n\nType de projet : (landing page / site vitrine / e-commerce / application)\nSecteur d'activité : \nFonctionnalités souhaitées : \nBudget approximatif : \nDélai souhaité : ")}`}
              className="profile-cta profile-cta--primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
            >
              <Mail size={13} />
              Demander un devis gratuit
            </a>
            <a
              href="https://wa.me/2290167266360?text=Bonjour%2C%20je%20souhaite%20un%20devis%20pour%20la%20création%20de%20mon%20site%20web."
              target="_blank"
              rel="noopener noreferrer"
              className="profile-cta"
              style={{ display: "inline-flex" }}
            >
              WhatsApp
            </a>
          </div>
        </section>

        <footer style={{ paddingBottom: "3rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>← Accueil</Link>
          <Link href="/services" style={{ fontSize: "var(--text-xs)", color: "#555" }}>Services</Link>
          <Link href="/projets" style={{ fontSize: "var(--text-xs)", color: "#555" }}>Projets</Link>
        </footer>
      </main>
    </>
  );
}
