"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { Zap, FileSearch, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Zap,
    label: "Core Service",
    title: "High-Converting Landing Pages",
    description:
      "Custom pages that convert traffic into leads, trials, and customers.",
  },
  {
    icon: FileSearch,
    label: "Analysis",
    title: "Website Conversion Audits",
    description:
      "I identify what's costing you conversions and give you a fix-it roadmap.",
  },
  {
    icon: TrendingUp,
    label: "Optimization",
    title: "Conversion Optimization",
    description:
      "A/B testing and flow fixes to maximize value from existing traffic.",
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    cardsRef.current = [];

    const ctx = gsap.context(() => {
      const playAnimation = () => {
        const tl = gsap.timeline();

        // Cards stagger
        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          const cardTl = gsap.timeline();

          // Card container
          cardTl.fromTo(
            card,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          );

          // Éléments internes (hiérarchie)
          const icon = card.querySelector(".service-icon");
          const label = card.querySelector(".service-label");
          const title = card.querySelector(".service-title");
          const description = card.querySelector(".service-description");

          cardTl
            .fromTo(
              icon,
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.2)" },
              "-=0.3",
            )
            .fromTo(
              label,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3 },
              "-=0.2",
            )
            .fromTo(
              title,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3 },
              "-=0.2",
            )
            .fromTo(
              description,
              { opacity: 0 },
              { opacity: 1, duration: 0.3 },
              "-=0.2",
            );

          // Ajoute au timeline principal avec stagger
          tl.add(cardTl, index * 0.2);
        });

        return tl;
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          setAnimationKey((prev) => prev + 1);
          playAnimation();
        },
        onEnterBack: () => {
          setAnimationKey((prev) => prev + 1);
          playAnimation();
        },
        onLeave: () => {
          gsap.set([...cardsRef.current], { clearProps: "all" });
        },
        onLeaveBack: () => {
          gsap.set([...cardsRef.current], { clearProps: "all" });
        },
      });

      // Parallax au scroll (desktop uniquement)
      const isMobile = window.innerWidth < 1024;

      if (!isMobile) {
        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          gsap.to(card, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            y: -10 + index * 5,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6">
        {/* Section header avec animation lettre par lettre */}
        <div
          ref={titleRef}
          className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"
        >
          <motion.h2
            key={animationKey}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {"What I Do".split("").map((char, i) => (
              <motion.span
                key={`title-${i}`}
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
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="group cursor-pointer rounded-2xl bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-muted/30 lg:p-8"
              >
                {/* Icône */}
                <div className="service-icon mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Label catégorie */}
                <div className="service-label mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  {service.label}
                </div>

                {/* Titre */}
                <h3 className="service-title mb-3 text-xl font-semibold">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="service-description leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
