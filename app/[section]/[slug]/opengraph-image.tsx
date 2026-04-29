import { ImageResponse } from "next/og";
import { getPostBySlug, getPostsForSection, SECTIONS, SECTION_LABELS } from "@/lib/content";
import type { Section } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return SECTIONS.flatMap((section) =>
    getPostsForSection(section).map((post) => ({ section, slug: post.slug }))
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const post = getPostBySlug(section as Section, slug);
  const label = SECTION_LABELS[section as Section] ?? section;
  const title = post?.frontmatter.title ?? "Article";
  const fontSize = title.length > 65 ? 42 : title.length > 45 ? 48 : 54;

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
        <div style={{ display: "flex" }}>
          <div style={{ fontSize: 14, color: "#444", letterSpacing: "3px", textTransform: "uppercase" }}>
            {label}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              fontSize,
              fontWeight: 600,
              color: "#f0f0f0",
              letterSpacing: "-1.5px",
              lineHeight: 1.15,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 18, color: "#555" }}>{post?.readingTime ?? ""}</div>
          <div style={{ fontSize: 18, color: "#333" }}>aboudouzinsou.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
