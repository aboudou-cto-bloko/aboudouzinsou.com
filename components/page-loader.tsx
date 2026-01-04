"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      // Animation des paths (A puis Z)
      pathsRef.current.forEach((path, index) => {
        if (!path) return;

        const length = path.getTotalLength();

        // Préparer le path
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "none",
          stroke: "var(--primary)",
          strokeWidth: 3,
        });

        // Dessiner le path
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          index * 0.4, // Stagger entre A et Z
        );

        // Remplir le path
        tl.to(
          path,
          {
            fill: "var(--primary)",
            stroke: "none",
            duration: 0.4,
          },
          `-=0.2`,
        );
      });

      // Pause puis recommencer
      tl.to({}, { duration: 0.5 });

      // Temps minimum de chargement
      const minLoadTime = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => clearTimeout(minLoadTime);
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isLoading && loaderRef.current) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isLoading]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 w-auto md:h-40"
      >
        <g transform="translate(10, 5)">
          <path
            ref={(el) => {
              if (el) pathsRef.current[0] = el;
            }}
            d="M 0 45 L 18 0 L 30 0 L 30 12 L 16 45 Z"
          />
          <path
            ref={(el) => {
              if (el) pathsRef.current[1] = el;
            }}
            d="M 35 0 L 80 0 L 80 8 L 50 22 L 80 37 L 80 45 L 35 45 L 35 37 L 65 23 L 35 8 Z"
          />
        </g>
      </svg>
    </div>
  );
}
