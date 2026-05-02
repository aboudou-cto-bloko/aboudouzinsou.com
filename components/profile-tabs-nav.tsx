import Link from "next/link";

const SECTION_LABELS: Record<string, string> = {
  articles:   "Articles",
  insights:   "Insights",
  devlog:     "Devlog",
  tutoriels:  "Tutoriels",
  ressources: "Ressources",
};

type Props = {
  active: string;
  counts: Record<string, number>;
};

export function ProfileTabsNav({ active, counts }: Props) {
  return (
    <div className="profile-tabs" role="tablist">
      {Object.entries(SECTION_LABELS).map(([section, label]) => {
        const count = counts[section] ?? 0;
        if (count === 0) return null;
        return (
          <Link
            key={section}
            href={`/${section}`}
            role="tab"
            aria-selected={active === section}
            className={`profile-tab${active === section ? " profile-tab--active" : ""}`}
          >
            {label}
            <span className="profile-tab-count">{count}</span>
          </Link>
        );
      })}
    </div>
  );
}
