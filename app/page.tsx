import { ProfileHero } from "@/components/profile-hero";
import { FeedFilter } from "@/components/feed-filter";
import { JsonLd } from "@/components/json-ld";
import { getRecentPosts, getPostsForSection, SECTIONS } from "@/lib/content";
import type { Metadata } from "next";

const BASE = "https://aboudouzinsou.com";

export const metadata: Metadata = {
  title: "Aboudou Zinsou",
  description:
    "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
  alternates: { canonical: BASE },
  openGraph: {
    type: "website",
    url: BASE,
    title: "Aboudou Zinsou",
    description: "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aboudou Zinsou",
    description: "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
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
    sameAs: [
      "https://github.com/aboudou-cto-bloko",
      "https://www.linkedin.com/in/fran%C3%A7oisab8099316/",
      "https://npmjs.com/package/moneroo",
    ],
    jobTitle: "Développeur Full-Stack SaaS",
    description: "Développeur full-stack SaaS, marché africain francophone. Fondateur de Pixel-Mart et BLOKO.",
    address: { "@type": "PostalAddress", addressLocality: "Cotonou", addressCountry: "BJ" },
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
          <a href="https://www.linkedin.com/in/fran%C3%A7oisab8099316/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {" · "}
          <a href="https://pixel-mart-bj.com" target="_blank" rel="noopener noreferrer">Pixel-Mart</a>
          {" · "}
          <a href="https://npmjs.com/package/moneroo" target="_blank" rel="noopener noreferrer">moneroo</a>
        </p>
      </footer>
    </main>
    </>
  );
}
