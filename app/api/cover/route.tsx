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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title   = searchParams.get("t") ?? "Sans titre";
  const section = searchParams.get("s") ?? "articles";
  const tags    = searchParams.get("g")?.split(",").filter(Boolean).slice(0, 3) ?? [];
  const reading = searchParams.get("r") ?? "";

  const accent = SECTION_COLORS[section] ?? "#888";
  const label  = section.charAt(0).toUpperCase() + section.slice(1);
  const fs     = title.length > 72 ? 36 : title.length > 52 ? 42 : title.length > 36 ? 48 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#090909",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent line top */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "3px",
            background: accent,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 64px 44px",
            height: "100%",
          }}
        >
          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontSize: 13,
                color: "#444",
                letterSpacing: "3px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {label}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 11,
                    color: "#333",
                    border: "1px solid #1e1e1e",
                    padding: "3px 10px",
                    borderRadius: "2px",
                    letterSpacing: "0.5px",
                    display: "flex",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: fs,
              fontWeight: 600,
              color: "#f0f0f0",
              letterSpacing: "-1.5px",
              lineHeight: 1.2,
              maxWidth: "680px",
              display: "flex",
            }}
          >
            {title}
          </div>

          {/* Footer row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#2d2d2d", display: "flex" }}>{reading}</span>
            <span style={{ fontSize: 14, color: "#222", display: "flex" }}>aboudouzinsou.com</span>
          </div>
        </div>
      </div>
    ),
    { width: 800, height: 400 }
  );
}
