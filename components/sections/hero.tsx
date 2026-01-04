"use client";

import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LogoHero } from "@/components/logo-hero";
import { RotatingWord } from "@/components/rotating-word";
import { GridBackground } from "../grid-background";
import { getCalApi } from "@calcom/embed-react";
import { VideoMockup } from "@/components/video-mockup";

const rotatingWords = [
  "profitable",
  "scalable",
  "measurable",
  "revenue-driven",
];

export function Hero() {
  const [calLoaded, setCalLoaded] = useState(false);

  const loadCal = useCallback(() => {
    if (calLoaded) return;
    setCalLoaded(true);

    (async function () {
      const cal = await getCalApi({ namespace: "audit-hero" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "column_view",
        styles: { branding: { brandColor: "#000000" } },
      });
    })();
  }, [calLoaded]);

  return (
    <section className="relative overflow-hidden bg-background">
      <GridBackground />

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-12 md:pb-24 md:pt-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo - animation simple */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 md:mb-14 lg:mb-16"
          >
            <LogoHero />
          </motion.div>

          {/* Headline - simplifié */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
          >
            <span className="block">I don&apos;t make websites pretty.</span>
            <span className="mt-1 block">
              I make them{" "}
              <RotatingWord
                words={rotatingWords}
                className="font-bold text-primary"
              />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:mt-6 md:text-xl lg:leading-loose"
          >
            Landing pages that turn traffic into paying customers—not just Figma
            files that look good in screenshots.
          </motion.p>

          {/* Badge - CSS animation */}
          <div className="mt-8 md:mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>No agency fluff. Just a dev who ships</span>
            </div>
          </div>

          {/* Vidéo - lazy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-12 md:mt-16 lg:mt-20"
          >
            <VideoMockup
              src="/presentation.webm"
              poster="/presentation-poster.jpg"
            />
          </motion.div>

          {/* CTA - lazy Cal.com */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="mt-12 md:mt-14"
          >
            <Button
              size="lg"
              onMouseEnter={loadCal}
              onFocus={loadCal}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
