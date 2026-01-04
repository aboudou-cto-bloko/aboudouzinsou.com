"use client";

import { useEffect, useRef } from "react";

export function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    // Trigger fade-out after hydration (mount)
    el.classList.add("fade-out");

    const timer = setTimeout(() => {
      el.style.display = "none";
    }, 600); // doit matcher la durée CSS

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={loaderRef}
      className="loader-overlay fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 w-auto md:h-40"
        aria-label="Loading"
      >
        <g transform="translate(10, 5)">
          <path
            d="M 0 45 L 18 0 L 30 0 L 30 12 L 16 45 Z"
            fill="hsl(var(--primary))"
          />
          <path
            d="M 35 0 L 80 0 L 80 8 L 50 22 L 80 37 L 80 45 L 35 45 L 35 37 L 65 23 L 35 8 Z"
            fill="hsl(var(--primary))"
          />
        </g>
      </svg>
    </div>
  );
}
