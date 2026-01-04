"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { getCalApi } from "@calcom/embed-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const urgencyRef = useRef<HTMLParagraphElement>(null);

  // Initialiser Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "audit-cta" });
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
        const tl = gsap.timeline();

        // 1. Card container reveal
        tl.fromTo(
          cardRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
          },
        );

        // 2. Headline (on attend motion.dev)
        // Pas d'animation GSAP ici

        // 3. Subheadline (on attend motion.dev)
        // Pas d'animation GSAP ici

        // 4. Button avec bounce
        tl.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "+=1.2", // Attend la fin des headlines
        );

        // 5. Badge social proof
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2",
        );

        // 6. Urgence subtile
        tl.fromTo(
          urgencyRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
          },
          "-=0.2",
        );

        return tl;
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => playAnimation(),
        onEnterBack: () => playAnimation(),
        onLeave: () => {
          gsap.set(
            [
              cardRef.current,
              headlineRef.current,
              subheadRef.current,
              buttonRef.current,
              badgeRef.current,
              urgencyRef.current,
            ],
            { clearProps: "all" },
          );
        },
        onLeaveBack: () => {
          gsap.set(
            [
              cardRef.current,
              headlineRef.current,
              subheadRef.current,
              buttonRef.current,
              badgeRef.current,
              urgencyRef.current,
            ],
            { clearProps: "all" },
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
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
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-lg transition-all duration-300 hover:shadow-xl lg:p-12"
        >
          {/* Headline avec animation lettre par lettre */}
          <motion.h2
            ref={headlineRef}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.025,
                  delayChildren: 0.4, // Commence après card reveal
                },
              },
            }}
          >
            {"Get Your Free Conversion Audit".split("").map((char, i) => (
              <motion.span
                key={`headline-${i}`}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h2>

          {/* Subheadline avec animation lettre par lettre */}
          <motion.p
            ref={subheadRef}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.015,
                  delayChildren: 1.2, // Commence après headline
                },
              },
            }}
          >
            {"15-minute call. I'll show you what's costing you conversions. No pitch, just actionable fixes."
              .split("")
              .map((char, i) => (
                <motion.span
                  key={`subhead-${i}`}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
          </motion.p>

          {/* CTA avec Cal.com */}
          <div ref={buttonRef} className="mt-8">
            <Button
              size="lg"
              className="text-base font-medium transition-transform hover:scale-105"
              data-cal-namespace="audit-cta"
              data-cal-link="franck-zinsou-0odrm8/audit"
              data-cal-config='{"layout":"column_view"}'
            >
              Book my free audit
            </Button>
          </div>

          {/* Social proof badge avec avatars réels */}
          <div
            ref={badgeRef}
            className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5"
          >
            <div className="flex -space-x-2">
              {/* Avatars générés via DiceBear API (public & gratuit) */}
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4"
                alt="Founder avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full ring-2 ring-background"
              />
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=c0aede"
                alt="Founder avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full ring-2 ring-background"
              />
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=d1d4f9"
                alt="Founder avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full ring-2 ring-background"
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              Join 50+ founders who got their audit
            </span>
          </div>

          {/* Urgence subtile */}
          <p ref={urgencyRef} className="mt-4 text-xs text-muted-foreground">
            Limited slots available this month
          </p>
        </div>
      </div>
    </section>
  );
}
