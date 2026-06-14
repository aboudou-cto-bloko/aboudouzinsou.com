import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SECTION_COLORS: Record<string, string> = {
  articles:   "#c8a86b",
  tutoriels:  "#6b8ec8",
  insights:   "#a86bc8",
  devlog:     "#6bc8a0",
  ressources: "#c86b6b",
  projets:    "#c8836b",
};

const SECTION_LABELS: Record<string, string> = {
  articles:   "Article",
  tutoriels:  "Tutoriel",
  insights:   "Insight",
  devlog:     "Devlog",
  ressources: "Ressource",
  projets:    "Projet",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title   = searchParams.get("t") ?? "Sans titre";
  const section = searchParams.get("s") ?? "articles";
  const tags    = searchParams.get("g")?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const reading = searchParams.get("r") ?? "";

  const accent = SECTION_COLORS[section] ?? "#888";
  const label  = SECTION_LABELS[section] ?? section;

  const fs =
    title.length > 80 ? 52 :
    title.length > 62 ? 62 :
    title.length > 44 ? 72 :
    title.length > 28 ? 84 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "system-ui, -apple-system, 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: 4,
            background: accent,
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 80px 60px 72px",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Section label */}
          <span
            style={{
              fontSize: 13,
              color: accent,
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontWeight: 600,
              display: "flex",
            }}
          >
            {label}
          </span>

          {/* Title */}
          <div
            style={{
              fontSize: fs,
              fontWeight: 600,
              color: "#f0ede8",
              letterSpacing: "-0.03em",
              lineHeight: 1.18,
              maxWidth: "920px",
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              {reading && (
                <span style={{ fontSize: 15, color: "#4a4a4a", display: "flex" }}>
                  {reading}
                </span>
              )}
              {tags.map((tag) => (
                <span key={tag} style={{ fontSize: 14, color: "#383838", display: "flex" }}>
                  #{tag}
                </span>
              ))}
            </div>
            <span
              style={{
                fontSize: 13,
                color: "#222",
                display: "flex",
                letterSpacing: "2px",
              }}
            >
              aboudouzinsou.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    }
  );
}
