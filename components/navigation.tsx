"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCalApi } from "@calcom/embed-react";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Optimisation avec passive listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialiser Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "audit-nav" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "column_view",
        styles: {
          branding: {
            brandColor: "#000000",
          },
        },
      });
    })();
  }, []);

  // Animation d'entrée au chargement
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Logo apparition
      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );

      // CTA apparition
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.4", // Overlap avec logo
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80"
          : "border-b border-transparent bg-background/0"
      }`}
    >
      <div className="container mx-auto px-6">
        <nav
          className="relative flex h-16 items-center justify-center"
          aria-label="Main navigation"
        >
          {/* Logo centré */}
          <Link
            ref={logoRef}
            href="/"
            className="group flex items-center rounded-sm transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Home"
          >
            <Logo className="h-8 w-auto text-foreground transition-colors duration-300 group-hover:text-primary md:h-10" />
          </Link>

          {/* CTA responsive avec Cal.com */}
          <div ref={ctaRef} className="absolute right-0">
            <Button
              size="sm"
              className="font-medium transition-all duration-300 hover:scale-105 md:h-11 md:px-6 md:text-base"
              data-cal-namespace="audit-nav"
              data-cal-link="franck-zinsou-0odrm8/audit"
              data-cal-config='{"layout":"column_view"}'
            >
              <span className="md:hidden">Audit</span>
              <span className="hidden md:inline">Book free audit</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
