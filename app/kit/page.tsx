import type { Metadata } from "next";
import { KitForm } from "@/components/kit-form";
import { JsonLd } from "@/components/json-ld";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Dev Onboarding Kit — Processus client complet pour développeurs freelance",
  description:
    "9 phases, 10 templates. Du premier contact à la clôture. Contrats, devis, PV de recette, livraison — adapté au contexte africain (XOF, Wave, Mobile Money).",
  alternates: { canonical: `${BASE}/kit` },
  openGraph: {
    type: "website",
    url: `${BASE}/kit`,
    title: "Dev Onboarding Kit — Aboudou Zinsou",
    description: "Le processus client complet pour développeurs freelance. Gratuit.",
  },
};

const PHASES = [
  { num: "01", label: "Premier contact",         livrable: "Email de reformulation"                   },
  { num: "02", label: "Découverte",               livrable: "Brief validé par écrit"                   },
  { num: "03", label: "Proposition commerciale",  livrable: "Devis + spécifications fonctionnelles"    },
  { num: "04", label: "Contractualisation",       livrable: "Contrat ou bon de commande"               },
  { num: "05", label: "Kickoff",                  livrable: "Planning + convention de travail"         },
  { num: "06", label: "Développement itératif",   livrable: "Rapport de sprint"                        },
  { num: "07", label: "Recette",                  livrable: "Grille de tests + PV de réception signé"  },
  { num: "08", label: "Livraison",                livrable: "Transfert accès + documentation"          },
  { num: "09", label: "Clôture",                  livrable: "Email de suivi + bilan interne"           },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Dev Onboarding Kit",
  description: "9 phases, 10 templates pour professionnaliser le processus client d'un développeur freelance.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "XOF", availability: "https://schema.org/InStock" },
  author: { "@type": "Person", name: "Aboudou Zinsou", url: BASE },
};

export default function KitPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="site-container">

        {/* ── Hero ─────────────────────────────────────────── */}
        <section style={{ paddingBlock: "4rem 3rem" }}>
          <p
            className="about-section-label"
            style={{ marginBottom: "1.25rem" }}
          >
            Kit freelance · Gratuit
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, var(--text-xl))",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: "1.25rem",
            }}
          >
            Tu sais coder.<br />
            Tu sais pas gérer un client.
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#888",
              maxWidth: "44ch",
              lineHeight: 1.85,
            }}
          >
            Le processus client complet pour développeurs freelance — du premier
            contact à la clôture. 9 phases, 10 templates prêts à l&apos;emploi.
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", marginBottom: "3rem" }} />

        {/* ── Problème ─────────────────────────────────────── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Le problème</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { trigger: "Pas de brief validé par écrit",  consequence: "Le client change le périmètre en cours de route." },
              { trigger: "Pas de contrat signé",           consequence: "Impossible de facturer les modifications hors scope." },
              { trigger: "Pas d'acompte avant de démarrer", consequence: "Il disparaît après la livraison." },
              { trigger: "Pas de PV de recette",           consequence: "Les corrections deviennent infinies." },
              { trigger: "Pas de transfert documenté",     consequence: "Il te rappelle 6 mois plus tard parce qu'il a perdu les accès." },
            ].map(({ trigger, consequence }) => (
              <div
                key={trigger}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  padding: "0.875rem 0",
                  borderBottom: "1px solid #141414",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "#666",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {trigger}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "#444",
                    lineHeight: 1.7,
                  }}
                >
                  → {consequence}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Solution ─────────────────────────────────────── */}
        <section
          style={{
            marginBottom: "3.5rem",
            padding: "2rem",
            border: "1px solid #1e1e1e",
            background: "#0a0a0a",
          }}
        >
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "#aaa",
              lineHeight: 1.85,
              maxWidth: "52ch",
              marginBottom: "1.25rem",
            }}
          >
            Ce kit couvre tout le processus. Chaque phase vient avec un template
            prêt à copier-coller — rédigé pour le contexte africain francophone.
            XOF, Wave, MTN Mobile Money, Orange Money dans les clauses de paiement.
            Droit béninois dans le contrat.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "#555",
            }}
          >
            <span>9 phases</span>
            <span>·</span>
            <span>10 templates</span>
            <span>·</span>
            <span>PDF 30+ pages</span>
            <span>·</span>
            <span>Obsidian inclus</span>
          </div>
        </section>

        {/* ── Phases ───────────────────────────────────────── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Ce qui est dedans</p>
          <div className="about-projects">
            {PHASES.map((p) => (
              <div
                key={p.num}
                className="about-project"
                style={{ display: "grid", gridTemplateColumns: "3rem 1fr auto", gap: "1rem", alignItems: "baseline" }}
              >
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-mono)",
                    color: "#383838",
                    letterSpacing: "0.04em",
                    paddingTop: "0.1rem",
                  }}
                >
                  {p.num}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 400,
                    color: "var(--color-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#444",
                    fontFamily: "var(--font-mono)",
                    textAlign: "right",
                  }}
                >
                  {p.livrable}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", marginBottom: "3rem" }} />

        {/* ── Aperçu template ──────────────────────────────── */}
        <section style={{ marginBottom: "3.5rem" }}>
          <p className="about-section-label">Aperçu</p>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "#555",
              marginBottom: "1.25rem",
              lineHeight: 1.7,
              maxWidth: "46ch",
            }}
          >
            Voici à quoi ressemble le template de la Phase 01 — l&apos;email
            envoyé dans les 24h après le premier contact d&apos;un prospect.
          </p>

          <div
            style={{
              border: "1px solid #1e1e1e",
              background: "#0c0c0c",
            }}
          >
            {/* Header du bloc */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.625rem 1rem",
                borderBottom: "1px solid #1a1a1a",
                background: "#0a0a0a",
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontFamily: "var(--font-mono)",
                  color: "#383838",
                }}
              >
                template · email-reformulation.txt
              </span>
              <span
                style={{
                  fontSize: "0.625rem",
                  fontFamily: "var(--font-mono)",
                  color: "#2a2a2a",
                  border: "1px solid #1e1e1e",
                  padding: "1px 6px",
                }}
              >
                Phase 01
              </span>
            </div>

            {/* Contenu du template */}
            <pre
              style={{
                padding: "1.25rem 1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                lineHeight: 1.8,
                color: "#555",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
{`Objet : Suite à notre échange — [Nom du projet]

Bonjour [Prénom],

Merci pour votre message. Voici ce que j'ai retenu :

  Votre projet : [résumé en 1–2 phrases]

  Ce que vous souhaitez
  - [Besoin 1]
  - [Besoin 2]

  Contraintes mentionnées
  - Délai : [délai évoqué ou "à définir"]
  - Budget : [fourchette ou "à discuter"]

Si cette lecture correspond, je vous propose un appel
de 30–45 min pour creuser les détails.

Mes disponibilités :
  - [Jour] à [heure]
  - [Jour] à [heure]

[Votre prénom]`}
            </pre>
          </div>

          <p
            style={{
              fontSize: "0.75rem",
              color: "#333",
              marginTop: "0.875rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            + 9 autres templates dans le même format
          </p>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid #1a1a1a", marginBottom: "3rem" }} />

        {/* ── CTA ──────────────────────────────────────────── */}
        <section style={{ marginBottom: "5rem" }}>
          <p className="about-section-label">Accès gratuit</p>
          <h2
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              marginBottom: "0.875rem",
              color: "var(--color-primary)",
            }}
          >
            Ton email.<br />Le kit arrive immédiatement.
          </h2>
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "#555",
              marginBottom: "1.5rem",
              lineHeight: 1.7,
              maxWidth: "38ch",
            }}
          >
            PDF + templates Obsidian. Utilisable dès ce soir sur ton prochain projet.
          </p>

          <KitForm />
        </section>

        <footer style={{ paddingBottom: "3rem" }}>
          <a href="/" style={{ fontSize: "var(--text-xs)", color: "#444" }}>
            ← Accueil
          </a>
        </footer>

      </main>
    </>
  );
}
