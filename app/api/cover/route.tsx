import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SECTION_COLORS: Record<string, string> = {
  articles:   "#c8a86b",
  tutoriels:  "#6b8ec8",
  insights:   "#a86bc8",
  devlog:     "#6bc8a0",
  ressources: "#c86b6b",
};

const SECTION_LABELS: Record<string, string> = {
  articles:   "Article",
  tutoriels:  "Tutoriel",
  insights:   "Insight",
  devlog:     "Devlog",
  ressources: "Ressource",
};

function dhash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title   = searchParams.get("t") ?? "Sans titre";
  const section = searchParams.get("s") ?? "articles";
  const tags    = searchParams.get("g")?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const reading = searchParams.get("r") ?? "";

  const accent = SECTION_COLORS[section] ?? "#888";
  const label  = SECTION_LABELS[section] ?? section;
  const n = dhash(title + section);
  const variant = n % 4;
  const fs = title.length > 72 ? 33 : title.length > 52 ? 39 : title.length > 36 ? 45 : 51;

  // Four distinct gradient backgrounds
  const bgs = [
    // 0 — radial glow top-right
    `radial-gradient(ellipse 65% 85% at 94% 6%, ${accent}2a 0%, transparent 62%), #0a0a0a`,
    // 1 — linear diagonal, très subtil
    `linear-gradient(142deg, #0f0f0f 0%, ${accent}1c 46%, #090909 100%)`,
    // 2 — radial glow bottom-left
    `radial-gradient(ellipse 58% 72% at 6% 96%, ${accent}2e 0%, transparent 56%), #0a0a0a`,
    // 3 — bloom vertical depuis le bas
    `radial-gradient(ellipse 80% 55% at 50% 115%, ${accent}24 0%, transparent 58%), linear-gradient(180deg, #0c0c0c 0%, #090909 100%)`,
  ];

  const barAbove = variant === 1 || variant === 3;
  const barBelow = variant === 0 || variant === 2;

  return new ImageResponse(
    (
      <div
        style={{
          background: bgs[variant],
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* ── Éléments décoratifs par variant ── */}

        {/* Variant 0 : deux cercles concentriques coin top-right */}
        {variant === 0 && (
          <>
            <div style={{
              position: "absolute", top: -110, right: -110,
              width: 380, height: 380, borderRadius: "50%",
              border: `1px solid ${accent}14`, display: "flex",
            }} />
            <div style={{
              position: "absolute", top: -45, right: -45,
              width: 190, height: 190, borderRadius: "50%",
              border: `1px solid ${accent}20`, display: "flex",
            }} />
          </>
        )}

        {/* Variant 1 : ligne accent bas gauche → transparent */}
        {variant === 1 && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${accent}85 0%, transparent 65%)`,
            display: "flex",
          }} />
        )}

        {/* Variant 2 : deux cercles concentriques coin bottom-right */}
        {variant === 2 && (
          <>
            <div style={{
              position: "absolute", bottom: -90, right: -90,
              width: 320, height: 320, borderRadius: "50%",
              border: `1px solid ${accent}16`, display: "flex",
            }} />
            <div style={{
              position: "absolute", bottom: -35, right: -35,
              width: 160, height: 160, borderRadius: "50%",
              border: `1px solid ${accent}22`, display: "flex",
            }} />
          </>
        )}

        {/* Variant 3 : ligne accent bord gauche */}
        {variant === 3 && (
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: "2px",
            background: `linear-gradient(180deg, transparent 0%, ${accent}75 40%, ${accent}75 60%, transparent 100%)`,
            display: "flex",
          }} />
        )}

        {/* ── Contenu principal ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px 64px 40px",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Header : label section + tags */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{
              fontSize: 11, color: accent,
              letterSpacing: "3px", textTransform: "uppercase",
              display: "flex", background: `${accent}1a`,
              padding: "4px 11px", borderRadius: "2px", fontWeight: 500,
            }}>
              {label}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 10, color: "#4a4a4a",
                  border: "1px solid #1e1e1e",
                  padding: "3px 8px", borderRadius: "2px",
                  letterSpacing: "0.4px", display: "flex",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Titre avec barre accent */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {barAbove && (
              <div style={{
                width: 46, height: 2,
                background: accent,
                marginBottom: 18,
                display: "flex",
              }} />
            )}

            <div style={{
              fontSize: fs,
              fontWeight: 600,
              color: "#f3f0ec",
              letterSpacing: "-1.1px",
              lineHeight: 1.23,
              maxWidth: "690px",
              display: "flex",
            }}>
              {title}
            </div>

            {barBelow && (
              <div style={{
                width: 54, height: 2,
                background: `${accent}70`,
                marginTop: 18,
                display: "flex",
              }} />
            )}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#555", display: "flex", letterSpacing: "0.2px" }}>
              {reading}
            </span>
            <span style={{
              fontSize: 11, color: "#383838", display: "flex",
              letterSpacing: "1.8px", textTransform: "lowercase",
            }}>
              aboudouzinsou.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    }
  );
}
