"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

const featuredProject = {
  title: "VaultPay",
  type: "Fintech SaaS • Landing Page",
  challenge:
    "Pre-launch fintech needed 10,000 waitlist signups. Previous site: 4.6% conversion, amateur look, broken mobile experience.",
  solution:
    "Positioned against Western Union (1.5% vs 8-12% fees). Mobile-first design with licensing badges and real testimonials. Built in 3 weeks with Next.js + Tailwind.",
  link: "https://vaultpay.example.com",
};

const conceptProjects = [
  {
    title: "SaaS Conversion Audit",
    type: "B2B SaaS • Strategy",
    description:
      "B2B SaaS at $2M ARR with 10K visitors but 1.2% trial conversion. Rewrote hero, simplified pricing, added social proof above fold.",
    metric: "Projected: 1.2% → 2.5% = +$18.8K MRR",
  },
  {
    title: "Coach Site Rewrite",
    type: "High-Ticket • Sales Page",
    description:
      "$25K program closing 15%. Long-form sales page with emotional hooks, program breakdown, scarcity (10 client limit), and guarantee.",
    metric: "Psychology: Reciprocity + Authority + Scarcity",
  },
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<HTMLDivElement[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    conceptsRef.current = [];

    const ctx = gsap.context(() => {
      const playAnimation = () => {
        const tl = gsap.timeline();

        // 1. Featured project - Card puis contenu
        if (featuredRef.current) {
          // 1a. Card reveal
          tl.fromTo(
            featuredRef.current,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
            },
          );

          // 1b. Contenu interne en cascade
          const typeTag = featuredRef.current.querySelector(".project-type");
          const title = featuredRef.current.querySelector(".project-title");
          const challenge =
            featuredRef.current.querySelector(".project-challenge");
          const solution =
            featuredRef.current.querySelector(".project-solution");
          const link = featuredRef.current.querySelector(".project-link");

          tl.fromTo(
            typeTag,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
            "-=0.3",
          )
            .fromTo(
              title,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.2",
            )
            .fromTo(
              challenge,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.2",
            )
            .fromTo(
              solution,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.2",
            )
            .fromTo(
              link,
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
              "-=0.2",
            );
        }

        // 2. Concept projects - Cards puis contenu avec stagger
        conceptsRef.current.forEach((concept, index) => {
          if (!concept) return;

          const conceptTl = gsap.timeline();

          // 2a. Card reveal
          conceptTl.fromTo(
            concept,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            },
          );

          // 2b. Contenu interne
          const typeTag = concept.querySelector(".concept-type");
          const title = concept.querySelector(".concept-title");
          const description = concept.querySelector(".concept-description");
          const metric = concept.querySelector(".concept-metric");

          conceptTl
            .fromTo(
              typeTag,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
              "-=0.3",
            )
            .fromTo(
              title,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
              "-=0.2",
            )
            .fromTo(
              description,
              { opacity: 0 },
              { opacity: 1, duration: 0.3 },
              "-=0.1",
            )
            .fromTo(
              metric,
              { opacity: 0, x: -10 },
              { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
              "-=0.1",
            );

          // Ajoute au timeline principal avec stagger
          tl.add(conceptTl, 0.8 + index * 0.4);
        });

        return tl;
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        onEnter: () => {
          setAnimationKey((prev) => prev + 1); // Force remount titres
          playAnimation();
        },
        onEnterBack: () => {
          setAnimationKey((prev) => prev + 1); // Force remount titres
          playAnimation();
        },
        onLeave: () => {
          gsap.set([featuredRef.current, ...conceptsRef.current], {
            clearProps: "all",
          });
        },
        onLeaveBack: () => {
          gsap.set([featuredRef.current, ...conceptsRef.current], {
            clearProps: "all",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section header avec animation lettre par lettre */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          {/* Title animé lettre par lettre */}
          <motion.h2
            key={`title-${animationKey}`}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.03,
                },
              },
            }}
          >
            {"Recent Work".split("").map((char, i) => (
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

          {/* Subtitle animé lettre par lettre */}
          <motion.p
            key={`subtitle-${animationKey}`}
            className="mt-4 text-lg leading-relaxed text-muted-foreground"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.02,
                  delayChildren: 0.4,
                },
              },
            }}
          >
            {"One real project. Two concept demonstrations. All conversion-focused."
              .split("")
              .map((char, i) => (
                <motion.span
                  key={`subtitle-${i}`}
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
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Featured project - VaultPay */}
          <Card
            ref={featuredRef}
            className="group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl lg:row-span-2"
          >
            <CardHeader className="space-y-4">
              {/* Type tag */}
              <div className="project-type w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {featuredProject.type}
              </div>

              {/* Title */}
              <h3 className="project-title text-3xl font-bold transition-colors duration-300 group-hover:text-primary">
                {featuredProject.title}
              </h3>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Challenge */}
              <p className="project-challenge leading-relaxed text-muted-foreground">
                {featuredProject.challenge}
              </p>

              {/* Solution */}
              <p className="project-solution leading-relaxed text-foreground">
                {featuredProject.solution}
              </p>

              {/* Link */}
              <a
                href={featuredProject.link}
                className="project-link inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-300 hover:gap-3 hover:text-primary/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                View live site
                <ExternalLink className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>

          {/* Concept projects */}
          {conceptProjects.map((project, index) => (
            <Card
              key={index}
              ref={(el) => {
                if (el) conceptsRef.current[index] = el;
              }}
              className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <CardHeader className="space-y-3">
                {/* Type tag - ✅ Corrigé concept-type */}
                <div className="concept-type w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {project.type}
                </div>

                {/* Title */}
                <h3 className="concept-title text-2xl font-semibold transition-colors duration-300 group-hover:text-primary">
                  {project.title}
                </h3>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="concept-description text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {project.description}
                </p>

                {/* Metric */}
                <div className="concept-metric border-l-2 border-primary pl-4">
                  <p className="text-sm font-medium text-foreground">
                    {project.metric}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
