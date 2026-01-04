// components/sections/hero.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LogoHero } from "@/components/logo-hero";
import { RotatingWord } from "@/components/rotating-word";
import { GridBackground } from "../grid-background";
import { getCalApi } from "@calcom/embed-react";
import { VideoMockup } from "@/components/video-mockup";

gsap.registerPlugin(ScrollTrigger);

const rotatingWords = [
  "profitable",
  "scalable",
  "measurable",
  "revenue-driven",
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [animationKey, setAnimationKey] = useState(0);

  // Initialiser Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "audit-hero" });
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const playAnimation = () => {
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        // 1. Logo
        tl.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.6 },
        );

        // 2. Éléments logo
        const logoElements = logoRef.current?.querySelectorAll(
          ".logo-text, .logo-line",
        );
        if (logoElements && logoElements.length > 0) {
          tl.fromTo(
            logoElements,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
            "-=0.3",
          );
        }

        // 3. Headline (géré par motion.dev)

        // 4. Subheadline
        tl.fromTo(
          subheadRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "+=1.2",
        );

        // 5. Badge (preuve sociale)
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.2)" },
          "-=0.2",
        );

        // 6. Vidéo (démonstration)
        tl.fromTo(
          videoRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.1",
        );

        // 7. CTA (action finale)
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3",
        );

        return tl;
      };

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          setAnimationKey((prev) => prev + 1);
          playAnimation();
        },
        onEnterBack: () => {
          setAnimationKey((prev) => prev + 1);
          playAnimation();
        },
        onLeave: () => {
          gsap.set(
            [
              logoRef.current,
              subheadRef.current,
              badgeRef.current,
              videoRef.current,
              ctaRef.current,
            ],
            { clearProps: "all" },
          );
        },
        onLeaveBack: () => {
          gsap.set(
            [
              logoRef.current,
              subheadRef.current,
              badgeRef.current,
              videoRef.current,
              ctaRef.current,
            ],
            { clearProps: "all" },
          );
        },
      });

      // Parallax
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        opacity: 0.3,
        y: -50,
        scale: 0.98,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-background">
      <GridBackground />

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-12 md:pb-24 md:pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo */}
          <div ref={logoRef} className="mb-10 md:mb-14 lg:mb-16">
            <LogoHero />
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
          >
            <motion.span
              key={animationKey}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.03,
                    delayChildren: 0.6,
                  },
                },
              }}
            >
              <span className="block">
                {"I don't make websites pretty.".split("").map((char, i) => (
                  <motion.span
                    key={`line1-${i}`}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>

              <span className="mt-1 block">
                {"I make them ".split("").map((char, i) => (
                  <motion.span
                    key={`line2-${i}`}
                    variants={{
                      hidden: { opacity: 0 },
                      visible: { opacity: 1 },
                    }}
                    transition={{
                      delay: 0.9 + i * 0.03,
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <RotatingWord
                  words={rotatingWords}
                  className="font-bold text-primary"
                />
              </span>
            </motion.span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadRef}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:mt-6 md:text-xl lg:leading-loose"
          >
            Landing pages that turn traffic into paying customers—not just Figma
            files that look good in screenshots.
          </p>

          {/* Badge social proof */}
          <div ref={badgeRef} className="mt-8 md:mt-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>No agency fluff. Just a dev who ships</span>
            </div>
          </div>

          {/* Vidéo de démonstration */}
          <div ref={videoRef} className="mt-12 md:mt-16 lg:mt-20">
            <VideoMockup
              src="/presentation.webm"
              poster="/presentation-poster.jpg"
            />
          </div>

          {/* CTA principal */}
          <div ref={ctaRef} className="mt-12 md:mt-14">
            <Button
              size="lg"
              className="text-base font-medium shadow-lg transition-all hover:shadow-xl hover:shadow-primary/20"
              data-cal-namespace="audit-hero"
              data-cal-link="franck-zinsou-0odrm8/audit"
              data-cal-config='{"layout":"column_view"}'
            >
              Get your free conversion audit
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              15-minute call. No pitch, just actionable fixes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
