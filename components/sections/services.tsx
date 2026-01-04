"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Zap, FileSearch, TrendingUp } from "lucide-react";

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

// ✅ Variants sans fonction
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            What I Do
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={cardVariants}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="group cursor-pointer rounded-2xl bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-muted/30 lg:p-8"
              >
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                >
                  <motion.div
                    variants={itemVariants}
                    className="mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary"
                  >
                    {service.label}
                  </motion.div>

                  <motion.h3
                    variants={itemVariants}
                    className="mb-3 text-xl font-semibold"
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    variants={itemVariants}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {service.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
