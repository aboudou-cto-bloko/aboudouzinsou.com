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

type Props = {
  title: string;
  section: string;
  tags?: string[];
  readingTime?: string;
};

export function PostCoverCSS({ title, section, tags = [], readingTime }: Props) {
  const accent = SECTION_COLORS[section] ?? "#888";
  const label  = SECTION_LABELS[section] ?? section;
  const n       = dhash(title + section);
  const variant = n % 4;
  const barAbove = variant === 1 || variant === 3;
  const vis = tags.slice(0, 2);

  const bgs: Record<number, string> = {
    0: `radial-gradient(ellipse 65% 85% at 94% 6%, ${accent}29 0%, transparent 62%), #0a0a0a`,
    1: `linear-gradient(142deg, #0f0f0f 0%, ${accent}1c 46%, #090909 100%)`,
    2: `radial-gradient(ellipse 58% 72% at 6% 96%, ${accent}2e 0%, transparent 56%), #0a0a0a`,
    3: `radial-gradient(ellipse 80% 55% at 50% 115%, ${accent}24 0%, transparent 58%), linear-gradient(180deg, #0c0c0c 0%, #090909 100%)`,
  };

  return (
    <div
      style={{
        background: bgs[variant],
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(12px, 3.5%, 22px) clamp(16px, 5%, 30px)",
        boxSizing: "border-box",
      }}
      aria-hidden="true"
    >
      {/* ── Éléments décoratifs ── */}
      {variant === 0 && (
        <>
          <span style={{
            position: "absolute", top: "-25%", right: "-12%",
            width: "52%", aspectRatio: "1", borderRadius: "50%",
            border: `1px solid ${accent}14`, display: "block",
          }} />
          <span style={{
            position: "absolute", top: "-6%", right: "1%",
            width: "26%", aspectRatio: "1", borderRadius: "50%",
            border: `1px solid ${accent}20`, display: "block",
          }} />
        </>
      )}
      {variant === 1 && (
        <span style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "2px", display: "block",
          background: `linear-gradient(90deg, ${accent}85 0%, transparent 65%)`,
        }} />
      )}
      {variant === 2 && (
        <>
          <span style={{
            position: "absolute", bottom: "-25%", right: "-12%",
            width: "48%", aspectRatio: "1", borderRadius: "50%",
            border: `1px solid ${accent}16`, display: "block",
          }} />
          <span style={{
            position: "absolute", bottom: "-6%", right: "2%",
            width: "24%", aspectRatio: "1", borderRadius: "50%",
            border: `1px solid ${accent}22`, display: "block",
          }} />
        </>
      )}
      {variant === 3 && (
        <span style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "2px", display: "block",
          background: `linear-gradient(180deg, transparent 0%, ${accent}75 40%, ${accent}75 60%, transparent 100%)`,
        }} />
      )}

      {/* ── Header : section + tags ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
        <span style={{
          fontSize: "clamp(8px, 1.6vw, 11px)",
          color: accent,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: `${accent}18`,
          padding: "3px 8px",
          borderRadius: "2px",
          fontWeight: 500,
          flexShrink: 0,
          lineHeight: 1.5,
        }}>
          {label}
        </span>
        {vis.length > 0 && (
          <div style={{ display: "flex", gap: "4px", overflow: "hidden" }}>
            {vis.map((tag) => (
              <span key={tag} style={{
                fontSize: "clamp(7px, 1.4vw, 10px)",
                color: "#4a4a4a",
                border: "1px solid #1e1e1e",
                padding: "2px 6px",
                borderRadius: "2px",
                whiteSpace: "nowrap",
                lineHeight: 1.5,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Titre ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {barAbove && (
          <div style={{
            width: "clamp(28px, 6%, 44px)",
            height: "2px",
            background: accent,
            marginBottom: "clamp(8px, 1.8%, 16px)",
            flexShrink: 0,
          }} />
        )}
        <div style={{
          fontSize: "clamp(13px, 3.2vw, 20px)",
          fontWeight: 600,
          color: "#f3f0ec",
          letterSpacing: "-0.03em",
          lineHeight: 1.28,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {title}
        </div>
        {!barAbove && (
          <div style={{
            width: "clamp(32px, 7%, 52px)",
            height: "2px",
            background: `${accent}70`,
            marginTop: "clamp(8px, 1.8%, 16px)",
            flexShrink: 0,
          }} />
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "clamp(9px, 1.7vw, 12px)", color: "#555", lineHeight: 1 }}>
          {readingTime}
        </span>
        <span style={{
          fontSize: "clamp(8px, 1.4vw, 10px)",
          color: "#383838",
          letterSpacing: "0.15em",
          textTransform: "lowercase",
          lineHeight: 1,
        }}>
          aboudouzinsou.com
        </span>
      </div>
    </div>
  );
}
