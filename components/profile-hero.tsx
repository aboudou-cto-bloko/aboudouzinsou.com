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
  total: number;
};

export function ProfileHero({ total }: Props) {
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
        <h1 className="profile-name">Aboudou Zinsou</h1>
        <p className="profile-handle">@aboudouzinsou</p>
      </div>

      {/* ── Bio ── */}
      <p className="profile-bio">
        Développeur freelance à Cotonou. Je construis la mémoire opérationnelle des PME
        africaines — base de connaissances vivante, agents IA, intégration Mobile Money.
      </p>

      {/* ── Actions ── */}
      <div className="profile-actions">
        <a href="/services" className="profile-cta profile-cta--primary">
          Travailler avec moi
        </a>
        <a href="/about" className="profile-cta">
          Projets
        </a>
      </div>

      {/* ── Meta ── */}
      <div className="profile-meta">
        <span>Cotonou, Bénin</span>
        <a href="https://www.facebook.com/francois.SaasXpert" target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href="https://aboudouzinsou.com" target="_blank" rel="noopener noreferrer">
          aboudouzinsou.com
        </a>
        {total > 0 && (
          <span>{total} publication{total > 1 ? "s" : ""}</span>
        )}
      </div>

    </div>
  );
}
