"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Lazy load Cal.com
const loadCal = async () => {
  const { getCalApi } = await import("@calcom/embed-react");
  return getCalApi({ namespace: "audit-cta" });
};

// Lazy load GSAP (desktop only)
const loadGSAP = async () => {
  if (typeof window === "undefined" || window.innerWidth < 768) return null;
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
};

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [calLoaded, setCalLoaded] = useState(false);

  // Lazy load Cal.com on user interaction
  const handleCalClick = async () => {
    if (!calLoaded) {
      const cal = await loadCal();
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "column_view",
        styles: {
          branding: {
            brandColor: "#000000",
          },
        },
      });
      setCalLoaded(true);
    }
  };

  useEffect(() => {
    // Mobile: IntersectionObserver simple
    if (window.innerWidth < 768) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.3 },
      );

      if (cardRef.current) observer.observe(cardRef.current);

      return () => observer.disconnect();
    }

    let ctx: ReturnType<(typeof import("gsap"))["gsap"]["context"]> | null =
      null;

    loadGSAP().then((libs) => {
      if (!libs) return;
      const { gsap, ScrollTrigger } = libs;

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline();

            // Card reveal
            tl.fromTo(
              cardRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            );

            // Elements cascade
            const elements = [
              cardRef.current?.querySelector("h2"),
              cardRef.current?.querySelector("p"),
              cardRef.current?.querySelector(".cta-button"),
              cardRef.current?.querySelector(".social-badge"),
              cardRef.current?.querySelector(".urgency-text"),
            ];

            tl.fromTo(
              elements.filter(Boolean),
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.15,
                ease: "power2.out",
              },
              "-=0.3",
            );
          },
        });
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-background to-muted py-16 lg:py-24"
    >
      <div className="container mx-auto px-6">
        {/* CTA Card */}
        <div
          ref={cardRef}
          className="cta-card-mobile mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-lg transition-all duration-300 md:hover:shadow-xl lg:p-12"
        >
          {/* Headline - CSS animation simple */}
          <h2 className="animate-fade-in text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Get Your Free Conversion Audit
          </h2>

          {/* Subheadline */}
          <p className="animate-fade-in-delay-1 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            15-minute call. I&apos;ll show you what&apos;s costing you
            conversions. No pitch, just actionable fixes.
          </p>

          {/* CTA Button avec Cal.com lazy */}
          <div className="cta-button mt-8">
            <Button
              size="lg"
              className="text-base font-medium transition-transform md:hover:scale-105"
              data-cal-namespace="audit-cta"
              data-cal-link="franck-zinsou-0odrm8/audit"
              data-cal-config='{"layout":"column_view"}'
              onClick={handleCalClick}
            >
              Book my free audit
            </Button>
          </div>

          {/* Social proof badge - SVG inline */}
          <div className="social-badge mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5">
            <div className="flex -space-x-2">
              {/* Avatar 1 - Inline SVG */}
              <div className="h-8 w-8 rounded-full bg-blue-100 ring-2 ring-background">
                <svg viewBox="0 0 32 32" className="h-full w-full">
                  <circle cx="16" cy="16" r="16" fill="#b6e3f4" />
                  <circle cx="16" cy="14" r="5" fill="#1e3a8a" />
                  <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#1e3a8a" />
                </svg>
              </div>

              {/* Avatar 2 */}
              <div className="h-8 w-8 rounded-full bg-purple-100 ring-2 ring-background">
                <svg viewBox="0 0 32 32" className="h-full w-full">
                  <circle cx="16" cy="16" r="16" fill="#c0aede" />
                  <circle cx="16" cy="14" r="5" fill="#6b21a8" />
                  <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#6b21a8" />
                </svg>
              </div>

              {/* Avatar 3 */}
              <div className="h-8 w-8 rounded-full bg-indigo-100 ring-2 ring-background">
                <svg viewBox="0 0 32 32" className="h-full w-full">
                  <circle cx="16" cy="16" r="16" fill="#d1d4f9" />
                  <circle cx="16" cy="14" r="5" fill="#4338ca" />
                  <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#4338ca" />
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium text-foreground">
              Join 50+ founders who got their audit
            </span>
          </div>

          {/* Urgence subtile */}
          <p className="urgency-text mt-4 text-xs text-muted-foreground">
            Limited slots available this month
          </p>
        </div>
      </div>
    </section>
  );
}
