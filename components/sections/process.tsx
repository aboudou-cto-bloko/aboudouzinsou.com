"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Discovery",
    duration: "Days 1-3",
    description:
      "Strategy session to understand your business model, conversion goals, and buyer objections. We align on what success looks like before touching Figma.",
  },
  {
    number: "02",
    title: "Strategic Design",
    duration: "Days 4-8",
    description:
      "Wireframes → high-fidelity mockups rooted in conversion psychology. Clear value prop, single CTA, social proof positioned to counter objections. 2 revision rounds included.",
  },
  {
    number: "03",
    title: "Development",
    duration: "Days 9-14",
    description:
      "Next.js + Tailwind CSS. Mobile-first, performance-optimized (Lighthouse 90+), pixel-perfect. You own the code, no vendor lock-in.",
  },
  {
    number: "04",
    title: "Launch + Optimize",
    duration: "Days 15+",
    description:
      "30 days post-launch support. Set up conversion tracking, review results at 30 days, test what works. Not 'deliver and disappear.'",
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const badgesRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Reset des refs
    stepsRef.current = [];
    badgesRef.current = [];
    linesRef.current = [];

    const ctx = gsap.context(() => {
      const playAnimation = () => {
        const tl = gsap.timeline();

        // Reset initial de tous les badges et lignes (IMPORTANT !)
        badgesRef.current.forEach((badge) => {
          if (badge) {
            gsap.set(badge, {
              borderColor: "rgb(229, 231, 235)",
              color: "rgb(156, 163, 175)",
            });
          }
        });

        linesRef.current.forEach((line) => {
          if (line) {
            gsap.set(line, {
              height: 0,
              backgroundColor: "rgb(229, 231, 235)",
            });
          }
        });

        // Animer chaque step de haut en bas (01 → 04)
        stepsRef.current.forEach((step, index) => {
          if (!step) return;

          const stepTl = gsap.timeline();
          const badge = badgesRef.current[index];
          const line = linesRef.current[index];

          // Badge (bordure + numéro)
          if (badge) {
            stepTl.to(badge, {
              borderColor: "var(--primary)",
              color: "var(--primary)",
              duration: 0.6,
              ease: "power2.out",
            });
          }

          // Ligne de connexion
          if (line && index < steps.length - 1) {
            stepTl.to(
              line,
              {
                height: "100%",
                backgroundColor: "var(--primary)",
                duration: 0.4,
                ease: "power1.out",
              },
              "-=0.3",
            );
          }

          // Contenu
          const header = step.querySelector(".step-header");
          const description = step.querySelector(".step-description");

          stepTl
            .fromTo(
              header,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.4",
            )
            .fromTo(
              description,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
              "-=0.2",
            );

          // Ajoute au timeline principal avec stagger
          tl.add(stepTl, index * 0.5);
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
          // Reset à l'état gris quand on sort
          badgesRef.current.forEach((badge) => {
            if (badge) {
              gsap.set(badge, {
                borderColor: "rgb(229, 231, 235)",
                color: "rgb(156, 163, 175)",
              });
            }
          });
          linesRef.current.forEach((line) => {
            if (line) {
              gsap.set(line, {
                height: 0,
                backgroundColor: "rgb(229, 231, 235)",
              });
            }
          });
          // Reset contenu
          stepsRef.current.forEach((step) => {
            if (step) {
              const header = step.querySelector(".step-header");
              const description = step.querySelector(".step-description");
              gsap.set([header, description], { clearProps: "all" });
            }
          });
        },
        onLeaveBack: () => {
          // Reset à l'état gris quand on sort
          badgesRef.current.forEach((badge) => {
            if (badge) {
              gsap.set(badge, {
                borderColor: "rgb(229, 231, 235)",
                color: "rgb(156, 163, 175)",
              });
            }
          });
          linesRef.current.forEach((line) => {
            if (line) {
              gsap.set(line, {
                height: 0,
                backgroundColor: "rgb(229, 231, 235)",
              });
            }
          });
          // Reset contenu
          stepsRef.current.forEach((step) => {
            if (step) {
              const header = step.querySelector(".step-header");
              const description = step.querySelector(".step-description");
              gsap.set([header, description], { clearProps: "all" });
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section header avec animation lettre par lettre */}
        <div
          ref={titleRef}
          className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"
        >
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
            {"How This Works".split("").map((char, i) => (
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
                  delayChildren: 0.5,
                },
              },
            }}
          >
            {"No surprises. No scope creep. Just a clear path from discovery to launch."
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

        {/* Timeline */}
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step container */}
                <div
                  ref={(el) => {
                    if (el) stepsRef.current[index] = el;
                  }}
                  className="group relative flex gap-6 pb-16 transition-all duration-300 last:pb-0 hover:translate-x-2 lg:gap-8 lg:pb-20"
                >
                  {/* Badge circulaire + ligne */}
                  <div className="relative flex shrink-0 flex-col items-center">
                    {/* Badge numéro */}
                    <div
                      ref={(el) => {
                        if (el) badgesRef.current[index] = el;
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] bg-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg lg:h-20 lg:w-20"
                    >
                      <span className="text-2xl font-bold transition-all duration-300 lg:text-3xl">
                        {step.number}
                      </span>
                    </div>

                    {/* Ligne de connexion (sauf dernier) */}
                    {index < steps.length - 1 && (
                      <div
                        ref={(el) => {
                          if (el) linesRef.current[index] = el;
                        }}
                        className="absolute top-16 w-[3px] transition-all duration-300 group-hover:w-1 lg:top-20"
                        style={{
                          bottom: "-4rem",
                          left: "calc(50% - 1.5px)",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-3 lg:pt-4">
                    {/* Title + Duration */}
                    <div className="step-header mb-3 flex flex-col gap-1">
                      <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-primary lg:text-3xl">
                        {step.title}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {step.duration}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="step-description leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
