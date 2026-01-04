"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

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

// ✅ Variants sans fonctions (delay géré dans transition)
const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const badgeVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    borderColor: "rgb(229, 231, 235)",
  },
  visible: {
    scale: 1,
    opacity: 1,
    borderColor: "hsl(var(--primary))",
  },
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    backgroundColor: "hsl(var(--primary))",
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Process() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            How This Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg leading-relaxed text-muted-foreground"
          >
            No surprises. No scope creep. Just a clear path from discovery to
            launch.
          </motion.p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={stepVariants}
                transition={{
                  delay: index * 0.2,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="relative"
              >
                <div className="group relative flex gap-4 pb-12 transition-all duration-300 last:pb-0 hover:translate-x-2 md:gap-6 md:pb-16 lg:gap-8 lg:pb-20">
                  {/* Badge + ligne */}
                  <div className="relative flex shrink-0 flex-col items-center">
                    {/* Badge numéro */}
                    <motion.div
                      initial="hidden"
                      animate={isVisible ? "visible" : "hidden"}
                      variants={badgeVariants}
                      transition={{
                        delay: index * 0.2,
                        duration: 0.4,
                        ease: "backOut",
                      }}
                      className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] bg-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg md:h-16 md:w-16 lg:h-20 lg:w-20"
                    >
                      <motion.span
                        initial={{ opacity: 0, color: "rgb(156, 163, 175)" }}
                        animate={
                          isVisible
                            ? {
                                opacity: 1,
                                color: "hsl(var(--primary))",
                              }
                            : { opacity: 0, color: "rgb(156, 163, 175)" }
                        }
                        transition={{
                          delay: index * 0.2 + 0.2,
                          duration: 0.3,
                        }}
                        className="text-xl font-bold md:text-2xl lg:text-3xl"
                      >
                        {step.number}
                      </motion.span>
                    </motion.div>

                    {/* Ligne de connexion */}
                    {index < steps.length - 1 && (
                      <motion.div
                        initial="hidden"
                        animate={isVisible ? "visible" : "hidden"}
                        variants={lineVariants}
                        transition={{
                          delay: index * 0.2 + 0.3,
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        className="absolute top-14 w-[3px] origin-top transition-all duration-300 group-hover:w-1 md:top-16 lg:top-20"
                        style={{
                          bottom: "-3rem",
                          left: "calc(50% - 1.5px)",
                          backgroundColor: "rgb(229, 231, 235)",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <motion.div
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={contentVariants}
                    transition={{
                      delay: index * 0.2 + 0.2,
                      duration: 0.4,
                    }}
                    className="flex-1 pt-2 md:pt-3 lg:pt-4"
                  >
                    <div className="mb-2 flex flex-col gap-1 md:mb-3">
                      <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-primary md:text-2xl lg:text-3xl">
                        {step.title}
                      </h3>
                      <p className="text-xs font-medium text-primary md:text-sm">
                        {step.duration}
                      </p>
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground md:text-base">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
