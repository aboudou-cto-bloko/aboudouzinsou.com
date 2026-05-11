import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kit reçu — Dev Onboarding Kit",
  description: "Accès immédiat au Dev Onboarding Kit.",
  robots: { index: false, follow: false },
};

export default function KitMerciPage() {
  return (
    <main className="site-container">
      <section
        style={{
          paddingBlock: "5rem 3rem",
          maxWidth: "44ch",
        }}
      >
        {/* Confirmation */}
        <p
          style={{
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            color: "#383838",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          Kit · Accès immédiat
        </p>

        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            marginBottom: "1.25rem",
          }}
        >
          C&apos;est à toi.
        </h1>

        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "#777",
            lineHeight: 1.85,
            marginBottom: "2rem",
          }}
        >
          Le Dev Onboarding Kit est prêt à être téléchargé.
          9 phases, 10 templates — utilise-les sur ton prochain projet.
        </p>

        {/* Bouton de téléchargement */}
        <a
          href="/kit/dev-onboarding-kit.pdf"
          download="dev-onboarding-kit.pdf"
          className="profile-cta profile-cta--primary"
          style={{
            display: "inline-flex",
            gap: "0.5rem",
            marginBottom: "2.5rem",
            padding: "0.625rem 1.25rem",
            borderRadius: 0,
          }}
        >
          Télécharger le PDF
          <span aria-hidden="true">↓</span>
        </a>

        <hr style={{ border: "none", borderTop: "1px solid #141414", marginBottom: "2rem" }} />

        {/* Les 6 règles d'or — rappel */}
        <div>
          <p
            style={{
              fontSize: "0.6875rem",
              fontFamily: "var(--font-mono)",
              color: "#333",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Les 6 règles à ne jamais enfreindre
          </p>
          {[
            "Jamais de code sans acompte reçu",
            "Jamais de démarrage sans document signé",
            "Brief validé par écrit avant le devis",
            "PV de recette signé avant la mise en production",
            "Solde reçu avant le transfert des accès",
            "Toute évolution de périmètre = avenant écrit",
          ].map((rule, i) => (
            <div
              key={rule}
              style={{
                display: "flex",
                gap: "1rem",
                padding: "0.625rem 0",
                borderBottom: "1px solid #0f0f0f",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: "0.625rem",
                  fontFamily: "var(--font-mono)",
                  color: "#2a2a2a",
                  width: "1.5rem",
                  flexShrink: 0,
                }}
              >
                0{i + 1}
              </span>
              <span style={{ fontSize: "var(--text-xs)", color: "#555", lineHeight: 1.6 }}>
                {rule}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/kit" style={{ fontSize: "var(--text-xs)", color: "#444" }}>
            ← Retour au kit
          </a>
          <a href="/" style={{ fontSize: "var(--text-xs)", color: "#333" }}>
            Accueil
          </a>
        </div>
      </section>
    </main>
  );
}
