// components/grid-background.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function GridBackground() {
  const gridRef = useRef<SVGSVGElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      // Animer l'apparition des lignes de grille
      const lines = gridRef.current?.querySelectorAll("line");
      if (!lines || lines.length === 0) return;

      // Timeline pour l'apparition progressive
      const tl = gsap.timeline({ delay: 0.5 });

      // Grouper lignes par type (verticales et horizontales)
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

      // Préparer les lignes (strokeDashoffset)
      lines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      // Animer verticales du centre vers les bords
      const centerIndex = Math.floor(verticalLines.length / 2);
      verticalLines.forEach((line, index) => {
        const distance = Math.abs(index - centerIndex);
        const length = line.getTotalLength();

        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          distance * 0.05, // Stagger basé sur distance au centre
        );
      });

      // Animer horizontales du haut vers le bas
      horizontalLines.forEach((line, index) => {
        const length = line.getTotalLength();

        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          0.3 + index * 0.08, // Stagger progressif
        );
      });

      // Animation perpétuelle des reflets
      if (reflectionRef.current) {
        gsap.to(reflectionRef.current, {
          backgroundPosition: "200% 0%",
          duration: 8,
          ease: "linear",
          repeat: -1,
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grille SVG */}
      <svg
        ref={gridRef}
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient argenté pour les lignes */}
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor="rgb(156, 163, 175)"
              stopOpacity="0.1"
            />
            <stop
              offset="50%"
              stopColor="rgb(209, 213, 219)"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="rgb(156, 163, 175)"
              stopOpacity="0.1"
            />
          </linearGradient>
        </defs>

        {/* Lignes verticales */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (i / 19) * 100;
          return (
            <line
              key={`v-${i}`}
              x1={`${x}%`}
              y1="0%"
              x2={`${x}%`}
              y2="100%"
              stroke="url(#silverGradient)"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}

        {/* Lignes horizontales */}
        {Array.from({ length: 12 }).map((_, i) => {
          const y = (i / 11) * 100;
          return (
            <line
              key={`h-${i}`}
              x1="0%"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="url(#silverGradient)"
              strokeWidth="1"
              opacity="0.4"
            />
          );
        })}
      </svg>

      {/* Reflets argentés animés */}
      <div
        ref={reflectionRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(209, 213, 219, 0.15) 25%, rgba(229, 231, 235, 0.3) 50%, rgba(209, 213, 219, 0.15) 75%, transparent 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "0% 0%",
          pointerEvents: "none",
        }}
      />

      {/* Gradient fade aux bords */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />
    </div>
  );
}
