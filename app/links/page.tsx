import type { Metadata } from "next";
import { Github, Mail, ExternalLink, Linkedin, Package, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Links — Aboudou Zinsou",
  description: "GitHub, LinkedIn, projets, npm, email — tous mes liens.",
};

type LinkItem = {
  label: string;
  desc: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  tag?: string;
};

const LINKS: LinkItem[] = [
  {
    label: "Pixel-Mart",
    desc: "Marketplace B2C béninoise",
    href: "https://pixel-mart-bj.com",
    Icon: ExternalLink,
    tag: "produit",
  },
  {
    label: "GitHub",
    desc: "aboudou-cto-bloko",
    href: "https://github.com/aboudou-cto-bloko",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    desc: "François Mawutô Aboudou Zinsou",
    href: "https://www.linkedin.com/in/fran%C3%A7oisab8099316/",
    Icon: Linkedin,
  },
  {
    label: "moneroo",
    desc: "SDK TypeScript pour l'API Moneroo",
    href: "https://npmjs.com/package/moneroo",
    Icon: Package,
    tag: "npm",
  },
  {
    label: "moneroo-mcp",
    desc: "Serveur MCP — agents IA et paiements africains",
    href: "https://npmjs.com/package/moneroo-mcp",
    Icon: Package,
    tag: "npm",
  },
  {
    label: "Articles",
    desc: "Ce que je lis, construis et pense",
    href: "/articles",
    Icon: FileText,
  },
  {
    label: "Email",
    desc: "aboudouzinsou@yahoo.com",
    href: "mailto:aboudouzinsou@yahoo.com",
    Icon: Mail,
  },
];

export default function LinksPage() {
  return (
    <main className="site-container">
      <section style={{ paddingBlock: "3rem 1.5rem" }}>
        <h1
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: "0.5rem",
          }}
        >
          Aboudou Zinsou
        </h1>
        <p style={{ fontSize: "var(--text-sm)", color: "#666" }}>
          Builder SaaS · Cotonou, Bénin
        </p>
      </section>

      <ul role="list" style={{ listStyle: "none", marginBottom: "4rem" }}>
        {LINKS.map(({ label, desc, href, Icon, tag }) => {
          const isExternal = href.startsWith("http") || href.startsWith("mailto");
          return (
            <li key={href}>
              <a
                href={href}
                className="links-item"
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span className="links-item__icon">
                  <Icon size={15} strokeWidth={1.5} />
                </span>
                <span className="links-item__body">
                  <span className="links-item__label">
                    {label}
                    {tag && <span className="badge badge--meta" style={{ marginLeft: "0.5rem" }}>{tag}</span>}
                  </span>
                  <span className="links-item__desc">{desc}</span>
                </span>
                <span className="links-item__arrow">→</span>
              </a>
            </li>
          );
        })}
      </ul>

      <footer style={{ paddingBottom: "3rem" }}>
        <a href="/" style={{ fontSize: "var(--text-xs)", color: "#555" }}>← Accueil</a>
      </footer>
    </main>
  );
}
