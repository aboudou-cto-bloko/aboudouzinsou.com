"use client";

import { TypewriterHeadline } from "./typewriter-headline";

const AZAvatar = () => (
  <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="profile-avatar-svg">
    <rect width="90" height="90" fill="#090909" />
    <g transform="translate(7, 22) scale(0.85)">
      <path d="M 0 45 L 18 0 L 30 0 L 30 12 L 16 45 Z" fill="#f0f0f0" />
      <path d="M 35 0 L 80 0 L 80 8 L 50 22 L 80 37 L 80 45 L 35 45 L 35 37 L 65 23 L 35 8 Z" fill="#f0f0f0" />
    </g>
  </svg>
);

type Props = {
  counts: Record<string, number>;
};

export function ProfileHero({ counts }: Props) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="profile-hero">

      {/* ── Banner ── */}
      <div className="profile-banner" aria-hidden="true">
        <div className="profile-banner-inner">
          <TypewriterHeadline />
        </div>
      </div>

      {/* ── Avatar row ── */}
      <div className="profile-avatar-row">
        <div className="profile-avatar">
          <AZAvatar />
        </div>
      </div>

      {/* ── Identity ── */}
      <div className="profile-identity">
        <p className="profile-name">Aboudou Zinsou</p>
        <p className="profile-handle">@aboudouzinsou</p>
      </div>

      {/* ── Bio ── */}
      <p className="profile-bio">
        Dev full-stack TypeScript. Je construis des SaaS pour le marché africain.
        {" "}VitrinAI · BLOKO · Pixel-Mart.
      </p>

      {/* ── Meta ── */}
      <div className="profile-meta">
        <span>Cotonou, Bénin</span>
        <a
          href="https://aboudouzinsou.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          aboudouzinsou.com
        </a>
        {total > 0 && (
          <span>{total} publication{total > 1 ? "s" : ""}</span>
        )}
      </div>

      {/* ── Content tabs/badges ── */}
      <div className="profile-tabs">
        {counts.articles > 0 && (
          <a href="/articles" className="profile-tab">
            Articles
            <span className="profile-tab-count">{counts.articles}</span>
          </a>
        )}
        {counts.insights > 0 && (
          <a href="/insights" className="profile-tab">
            Insights
            <span className="profile-tab-count">{counts.insights}</span>
          </a>
        )}
        {counts.devlog > 0 && (
          <a href="/devlog" className="profile-tab">
            Devlog
            <span className="profile-tab-count">{counts.devlog}</span>
          </a>
        )}
        {counts.tutoriels > 0 && (
          <a href="/tutoriels" className="profile-tab">
            Tutoriels
            <span className="profile-tab-count">{counts.tutoriels}</span>
          </a>
        )}
        {counts.ressources > 0 && (
          <a href="/ressources" className="profile-tab">
            Ressources
            <span className="profile-tab-count">{counts.ressources}</span>
          </a>
        )}
      </div>

      <div className="profile-divider" />
    </div>
  );
}
