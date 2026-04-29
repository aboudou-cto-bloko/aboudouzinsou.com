import { ImageResponse } from "next/og";

export const alt = "Aboudou Zinsou — Builder SaaS, Cotonou";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#090909",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: 64, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-2px", lineHeight: 1.1 }}>
            Je construis.
          </div>
          <div style={{ fontSize: 64, fontWeight: 600, color: "#f0f0f0", letterSpacing: "-2px", lineHeight: 1.1 }}>
            J&apos;écris ce que j&apos;apprends.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 22, color: "#555" }}>Builder SaaS · Cotonou, Bénin</div>
          <div style={{ fontSize: 20, color: "#333" }}>aboudouzinsou.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
