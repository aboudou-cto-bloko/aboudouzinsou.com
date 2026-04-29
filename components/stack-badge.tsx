import {
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siSupabase,
  siPrisma,
  siPhp,
  siMysql,
  siNodedotjs,
  siNx,
  siWhatsapp,
  siVercel,
  siConvex,
  siNrwl,
} from "simple-icons";

type SiIcon = { path: string; title: string };

// Normalize tech name → icon. Unmatched techs fall back to a letter badge.
const ICON_MAP: Record<string, SiIcon> = {
  "next.js":       siNextdotjs,
  "next.js 14":    siNextdotjs,
  "next.js 15":    siNextdotjs,
  "typescript":    siTypescript,
  "tailwind css":  siTailwindcss,
  "tailwind":      siTailwindcss,
  "supabase":      siSupabase,
  "prisma":        siPrisma,
  "php":           siPhp,
  "php 8.2":       siPhp,
  "mysql":         siMysql,
  "mysql 8":       siMysql,
  "node.js":       siNodedotjs,
  "nodejs":        siNodedotjs,
  "nx":            siNx,
  "nrwl":          siNrwl,
  "whatsapp api":  siWhatsapp,
  "whatsapp":      siWhatsapp,
  "vercel":        siVercel,
  "convex":        siConvex,
};

function LetterIcon({ name }: { name: string }) {
  const abbr = name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase();
  return (
    <span className="stack-badge__letter" aria-hidden="true">
      {abbr}
    </span>
  );
}

export function StackBadge({ name }: { name: string }) {
  const icon = ICON_MAP[name.toLowerCase()];
  return (
    <span className="stack-badge">
      <span className="stack-badge__icon" aria-hidden="true">
        {icon ? (
          <svg
            role="img"
            viewBox="0 0 24 24"
            width={11}
            height={11}
            fill="currentColor"
          >
            <path d={icon.path} />
          </svg>
        ) : (
          <LetterIcon name={name} />
        )}
      </span>
      <span className="stack-badge__name">{name}</span>
    </span>
  );
}
