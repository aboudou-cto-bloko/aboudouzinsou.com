const borderStyle = "1px solid #1e1e1e";
const labelStyle: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#555",
  marginBottom: "0.625rem",
};

export function ArticleTldr({ tldr }: { tldr?: string }) {
  if (!tldr) return null;
  return (
    <aside
      className="article-tldr"
      aria-label="TL;DR"
      style={{
        border: borderStyle,
        borderLeft: "3px solid #444",
        padding: "1.125rem 1.25rem",
        marginBottom: "2.5rem",
        background: "#0d0d0d",
      }}
    >
      <p style={labelStyle}>TL;DR</p>
      <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.65, color: "#ccc", margin: 0 }}>
        {tldr}
      </p>
    </aside>
  );
}

export function ArticleTakeaways({
  takeaways,
  tldr,
}: {
  takeaways?: string[];
  tldr?: string;
}) {
  const hasTakeaways = takeaways && takeaways.length > 0;
  if (!hasTakeaways && !tldr) return null;

  return (
    <aside
      aria-label="En résumé"
      style={{
        border: borderStyle,
        borderLeft: "3px solid #444",
        padding: "1.125rem 1.25rem",
        marginTop: "3rem",
        background: "#0d0d0d",
      }}
    >
      <p style={labelStyle}>En résumé</p>
      {hasTakeaways ? (
        <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
          {takeaways!.map((item, i) => (
            <li
              key={i}
              style={{ fontSize: "var(--text-sm)", lineHeight: 1.65, color: "#ccc", marginBottom: i < takeaways!.length - 1 ? "0.375rem" : 0 }}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.65, color: "#ccc", margin: 0 }}>
          {tldr}
        </p>
      )}
    </aside>
  );
}
