"use client";
import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0;
      bar.style.transform = `scaleX(${pct / 100})`;
      bar.style.opacity = pct > 0.5 ? "1" : "0";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      role="progressbar"
      aria-label="Progression de lecture"
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: "100%",
        opacity: 0,
        background: "var(--color-primary)",
        zIndex: 100,
        pointerEvents: "none",
        transformOrigin: "left",
        transform: "scaleX(0)",
        transition: "opacity 200ms ease",
      }}
    />
  );
}
