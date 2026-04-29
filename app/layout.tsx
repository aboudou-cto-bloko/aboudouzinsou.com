import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Nav } from "@/components/nav";
import { GlobalUI } from "@/components/global-ui";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aboudou Zinsou",
    template: "%s — Aboudou Zinsou",
  },
  description:
    "Dev full-stack SaaS, marché africain francophone. J'écris sur ce que je construis.",
  metadataBase: new URL("https://aboudouzinsou.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://aboudouzinsou.com",
    siteName: "Aboudou Zinsou",
  },
  icons: { icon: "/favicon.ico" },
  alternates: {
    types: { "application/rss+xml": "https://aboudouzinsou.com/feed.xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jost.variable}>
      <body style={{ background: "#090909", color: "#f0f0f0" }}>
        <Nav />
        <GlobalUI />
        {children}
      </body>
    </html>
  );
}
