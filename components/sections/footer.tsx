"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const brandingRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const playAnimation = () => {
        const tl = gsap.timeline();

        // Stagger des 3 colonnes
        tl.fromTo(
          brandingRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        )
          .fromTo(
            contactRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3", // Overlap
          )
          .fromTo(
            ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3", // Overlap
          );

        return tl;
      };

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 85%",
        end: "bottom bottom",
        onEnter: () => playAnimation(),
        onEnterBack: () => playAnimation(),
        onLeave: () => {
          gsap.set([brandingRef.current, contactRef.current, ctaRef.current], {
            clearProps: "all",
          });
        },
        onLeaveBack: () => {
          gsap.set([brandingRef.current, contactRef.current, ctaRef.current], {
            clearProps: "all",
          });
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="border-t border-border bg-background py-12 md:py-16"
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          {/* Branding + Copyright */}
          <div
            ref={brandingRef}
            className="flex flex-col items-center gap-2 md:items-start"
          >
            <span className="text-lg font-bold tracking-tight transition-colors duration-300 hover:text-primary">
              AZ
            </span>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Aboudou Zinsou
            </p>
          </div>

          {/* Contact links */}
          <div ref={contactRef} className="flex items-center gap-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/2290147876843"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          {/* CTA droite */}
          <a
            ref={ctaRef}
            href="mailto:aboudou@aboudouzinsou.com"
            className="text-sm font-medium text-primary transition-all duration-300 hover:text-primary/80 hover:underline"
          >
            Get in touch
          </a>
        </div>
      </div>
    </footer>
  );
}
