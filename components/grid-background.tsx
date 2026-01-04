// components/grid-background.tsx
export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/95 to-black">
      {/* Grille CSS */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(229, 231, 235, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 231, 235, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "clamp(80px, 15vw, 180px) clamp(80px, 15vh, 180px)",
        }}
      />

      {/* Shimmer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="shimmer-effect absolute inset-0" />
      </div>

      {/* Glow respirant amélioré */}
      <div className="glow-effect pointer-events-none absolute inset-0 hidden md:block" />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0%,
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            transform: translateX(100%);
            opacity: 0.6;
          }
        }

        @keyframes breathe {
          0% {
            opacity: 0.15;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.04);
          }
          100% {
            opacity: 0.15;
            transform: scale(0.96);
          }
        }

        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 45%,
            rgba(255, 255, 255, 0.06) 50%,
            transparent 55%,
            transparent 100%
          );
          width: 200%;
          animation: shimmer 18s ease-in-out infinite;
        }

        .glow-effect {
          background: radial-gradient(
            ellipse 60% 40% at 50% 45%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          animation: breathe 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @media (max-width: 768px) {
          .shimmer-effect {
            animation-duration: 25s;
          }
          .glow-effect {
            animation-duration: 5s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer-effect,
          .glow-effect {
            animation: none;
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
}
