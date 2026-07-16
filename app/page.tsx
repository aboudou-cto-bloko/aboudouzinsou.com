import { ProfileHero } from "@/components/profile-hero";
import { FeedFilter } from "@/components/feed-filter";
import { JsonLd } from "@/components/json-ld";
import { getRecentPosts, getPostsForSection, SECTIONS } from "@/lib/content";
import type { Metadata } from "next";

const BASE = "https://aboudouzinsou.com";

const TITLE = "Aboudou Zinsou — Développeur Web au Bénin (Cotonou) · Sites, E-commerce & Agents IA";
const DESC = "Développeur web freelance basé à Cotonou. Sites vitrine, e-commerce avec Mobile Money, SaaS sur mesure et agents IA pour PME béninoises. Devis gratuit sous 24h.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: BASE },
  openGraph: {
    type: "website",
    url: BASE,
    title: TITLE,
    description: DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

export default function HomePage() {
  const posts = getRecentPosts(100);

  const counts = SECTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: getPostsForSection(s).length }),
    {} as Record<string, number>
  );

  const feedPosts = posts.map((p) => ({
    slug: p.slug,
    section: p.section,
    url: p.url,
    frontmatter: { title: p.frontmatter.title, date: p.frontmatter.date, tags: p.frontmatter.tags },
    excerpt: p.excerpt,
    readingTime: p.readingTime,
  }));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aboudou Zinsou",
    url: BASE,
    description: "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
    inLanguage: "fr-FR",
    author: { "@type": "Person", name: "Aboudou Zinsou" },
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aboudou Zinsou",
    alternateName: "François Mawutô Aboudou ZINSOU",
    url: BASE,
    email: "pro@aboudouzinsou.com",
    sameAs: [
      "https://github.com/aboudou-cto-bloko",
      "https://www.linkedin.com/in/fran%C3%A7oisab8099316/",
      "https://x.com/aboudouzinsou",
      "https://www.facebook.com/francois.SaasXpert",
      "https://npmjs.com/package/moneroo",
      "https://eazysell-bj.online",
    ],
    jobTitle: "Développeur Full-Stack SaaS — Intelligence d'entreprise & Paiements Africains",
    knowsAbout: ["Intelligence d'entreprise", "Base de connaissances PME", "Agents IA", "Next.js", "TypeScript", "Convex", "RAG", "Mobile Money", "Moneroo", "SaaS Afrique", "IA pour PME béninoises", "Google Business"],
    description: "Je construis la mémoire et l'intelligence opérationnelle des PME africaines. Basé à Cotonou, Bénin. Fondateur de BLOKO, VitrinAI et EazySell.",
    address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
    worksFor: [
      { "@type": "Organization", name: "BLOKO" },
      { "@type": "Organization", name: "Pixel-Mart", url: "https://pixel-mart-bj.com" },
      { "@type": "Organization", name: "VitrinAI", url: "https://vitrinai-eta.vercel.app" },
      { "@type": "Organization", name: "EazySell", url: "https://eazysell-bj.online" },
    ],
    owns: [
      {
        "@type": "Organization",
        name: "EazySell",
        url: "https://eazysell-bj.online",
        description: "L'IA qui fait grandir les entreprises béninoises — Google Business, chatbots IA, CRM, agents métiers.",
        areaServed: { "@type": "City", name: "Cotonou" },
      },
    ],
  };

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={personJsonLd} />
    <main className="site-container">

      <ProfileHero total={feedPosts.length} />

      <FeedFilter posts={feedPosts} counts={counts} />

      <footer style={{ paddingBlock: "5rem 3rem" }}>
        <p style={{ fontSize: "var(--text-xs)", color: "#555" }}>
          <a href="https://github.com/aboudou-cto-bloko" target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}
          <a href="https://www.facebook.com/francois.SaasXpert" target="_blank" rel="noopener noreferrer">Facebook</a>
          {" · "}
          <a href="https://x.com/aboudouzinsou" target="_blank" rel="noopener noreferrer">X</a>
          {" · "}
          <a href="https://www.linkedin.com/in/fran%C3%A7oisab8099316/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {" · "}
          <a href="/projets">Projets</a>
          {" · "}
          <a href="/tarifs">Tarifs</a>
          {" · "}
          <a href="/services">Services</a>
          {" · "}
          <a href="mailto:pro@aboudouzinsou.com">Contact</a>
        </p>
      </footer>
    </main>
    </>
  );
}
