"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LogoHeroProps {
  className?: string;
}

export function LogoHero({ className }: LogoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Symbole AZ - Paths apparaissent avec scale + fade
      const paths = symbolRef.current?.querySelectorAll("path");
      if (paths && paths.length > 0) {
        tl.fromTo(
          paths,
          {
            opacity: 0,
            scale: 0.8,
            transformOrigin: "center center",
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1, // A puis Z
            ease: "back.out(1.2)",
          },
        );
      }

      // 2. Texte "ABOUDOUZINSOU.COM" - Fade + slide up
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.3", // Overlap avec symbole
      );

      // 3. Ligne accent - ScaleX depuis le centre
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2", // Overlap avec texte
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center gap-3 ${className}`}
    >
      {/* Symbole AZ */}
      <svg
        ref={symbolRef}
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-auto md:h-20"
      >
        <g transform="translate(10, 5)">
          <path
            d="M 0 45 L 18 0 L 30 0 L 30 12 L 16 45 Z"
            fill="currentColor"
          />
          <path
            d="M 35 0 L 80 0 L 80 8 L 50 22 L 80 37 L 80 45 L 35 45 L 35 37 L 65 23 L 35 8 Z"
            fill="currentColor"
          />
        </g>
      </svg>

      {/* Texte sous le symbole */}
      <div className="logo-text flex flex-col items-center gap-1">
        <span
          ref={textRef}
          className="text-sm font-bold tracking-[0.3em] text-foreground md:text-base"
        >
          ABOUDOUZINSOU.COM
        </span>
        {/* Ligne accent */}
        <div
          ref={lineRef}
          className="logo-line h-0.5 w-32 origin-center bg-primary"
        />
      </div>
    </div>
  );
}
