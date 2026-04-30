import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#090909",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          fontFamily: "monospace",
        }}
      >
        <span style={{ color: "#c8a86b", fontSize: 18, fontWeight: 700, letterSpacing: -1 }}>
          {"{"}
        </span>
        <span style={{ color: "#f0f0f0", fontSize: 16, fontWeight: 700, letterSpacing: -1, margin: "0 1px" }}>
          AZ
        </span>
        <span style={{ color: "#c8a86b", fontSize: 18, fontWeight: 700, letterSpacing: -1 }}>
          {"}"}
        </span>
      </div>
    ),
    { ...size }
  );
}
