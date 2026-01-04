// components/grid-background.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function GridBackground() {
  const gridRef = useRef<SVGSVGElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const lines = gridRef.current?.querySelectorAll("line");
      if (!lines || lines.length === 0) return;

      // Grouper lignes par type
      const verticalLines: SVGLineElement[] = [];
      const horizontalLines: SVGLineElement[] = [];

      lines.forEach((line) => {
        const x1 = line.getAttribute("x1");
        const x2 = line.getAttribute("x2");
        if (x1 === x2) {
          verticalLines.push(line);
        } else {
          horizontalLines.push(line);
        }
      });

      // Timeline maître
      const masterTL = gsap.timeline();

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 1. APPARITION INITIALE (verticales depuis le centre)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      verticalLines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      // Calculer centre
      const centerIndex = Math.floor(verticalLines.length / 2);

      masterTL.to(
        verticalLines,
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.out",
          stagger: {
            each: 0.08,
            from: centerIndex,
            grid: "auto",
          },
          delay: 0.5,
        },
        0,
      );

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 2. APPARITION HORIZONTALES (top to bottom)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      horizontalLines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      masterTL.to(
        horizontalLines,
        {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power1.out",
          stagger: 0.06,
        },
        0.8, // Commence pendant que verticales finissent
      );

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 3. PULSE SUBTIL DES LIGNES CENTRALES
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      const centralLines = Array.from(lines).filter((line) => {
        return line.classList.contains("central-line");
      });

      if (centralLines.length > 0) {
        gsap.to(centralLines, {
          opacity: 0.9,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
          delay: 2,
        });
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 4. SHIMMER ÉLÉGANT (gauche → droite → gauche)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      if (shimmerRef.current) {
        gsap.fromTo(
          shimmerRef.current,
          {
            x: "-100%",
            opacity: 0,
          },
          {
            x: "100%",
            opacity: 1,
            duration: 12,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2.5,
          },
        );
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 5. GLOW CENTRAL RESPIRANT
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          {
            opacity: 0.2,
            scale: 0.95,
          },
          {
            opacity: 0.5,
            scale: 1.05,
            duration: 5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 2,
          },
        );
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 6. SCAN LINE VERTICAL (effet futuriste)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      if (scanLineRef.current) {
        gsap.to(scanLineRef.current, {
          y: "100%",
          duration: 8,
          ease: "none",
          repeat: -1,
          delay: 3,
        });
      }

      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // 7. PARTICULES FLOTTANTES
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll(".particle");
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: "random(-100, 100)",
            x: "random(-50, 50)",
            opacity: "random(0.2, 0.6)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.3,
          });
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900/95 to-black">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* GRILLE SVG MÉTALLIQUE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <svg
        ref={gridRef}
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient argenté premium */}
          <linearGradient id="metalSilver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0.08" />
            <stop offset="20%" stopColor="#f3f4f6" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#f3f4f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0.08" />
          </linearGradient>

          {/* Gradient chrome brillant (lignes centrales) */}
          <linearGradient id="chromeSilver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" stopOpacity="0.15" />
            <stop offset="35%" stopColor="#f9fafb" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#f9fafb" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.15" />
          </linearGradient>

          {/* Filtre métallique avec léger blur */}
          <filter id="metallic" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.3"
              result="blur"
            />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Filtre glow pour lignes centrales */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Lignes verticales */}
        {Array.from({ length: 28 }).map((_, i) => {
          const x = (i / 27) * 100;
          const isCentral = Math.abs(i - 13.5) < 4;
          return (
            <line
              key={`v-${i}`}
              x1={`${x}%`}
              y1="0%"
              x2={`${x}%`}
              y2="100%"
              stroke={isCentral ? "url(#chromeSilver)" : "url(#metalSilver)"}
              strokeWidth={isCentral ? "1.5" : "1"}
              filter={isCentral ? "url(#glow)" : "url(#metallic)"}
              className={isCentral ? "central-line" : ""}
            />
          );
        })}

        {/* Lignes horizontales */}
        {Array.from({ length: 18 }).map((_, i) => {
          const y = (i / 17) * 100;
          const isCentral = Math.abs(i - 8.5) < 3;
          return (
            <line
              key={`h-${i}`}
              x1="0%"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke={isCentral ? "url(#chromeSilver)" : "url(#metalSilver)"}
              strokeWidth={isCentral ? "1.5" : "1"}
              filter={isCentral ? "url(#glow)" : "url(#metallic)"}
              className={isCentral ? "central-line" : ""}
            />
          );
        })}
      </svg>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* GLOW CENTRAL RESPIRANT */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)",
          opacity: 0.2,
        }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SHIMMER MÉTALLIQUE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={shimmerRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, transparent 45%, rgba(255, 255, 255, 0.06) 50%, transparent 55%, transparent 100%)",
            width: "200%",
            transform: "translateX(-100%)",
            opacity: 0,
          }}
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* SCAN LINE VERTICAL (effet futuriste) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={scanLineRef}
          className="absolute left-0 right-0 h-px"
          style={{
            top: "-100%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* PARTICULES FLOTTANTES SUBTILES */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <div ref={particlesRef} className="pointer-events-none absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="particle absolute h-1 w-1 rounded-full bg-white"
            style={{
              left: `${(i / 11) * 100}%`,
              top: `${40 + (i % 3) * 20}%`,
              opacity: 0.2,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* VIGNETTE ÉLÉGANTE */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />
    </div>
  );
}
