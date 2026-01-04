"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCalApi } from "@calcom/embed-react";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How do you measure success?",
    answer:
      "Conversion rate. If your page converts at 2% and we hit 4%, you'll know it worked. I help you set up tracking and review results 30 days post-launch. No vanity metrics. Just: did more people take action?",
  },
  {
    question: "Why should I hire you instead of an agency?",
    answer:
      "Same quality, no 3X markup. You work directly with me—no project managers, no bureaucracy. Just the person who designs and codes your site.",
  },
  {
    question: "Do you only work with SaaS companies?",
    answer:
      "SaaS is my specialty, but I also work with high-ticket coaches and e-commerce brands. If your business depends on converting traffic into customers or leads, we can talk. If you need a blog redesign or Shopify theme, this isn't the right fit.",
  },
  {
    question: "What if I don't like the design?",
    answer:
      "We work in phases with 2 revision rounds included. You approve wireframes before mockups. You approve mockups before I code. If we're not aligned after discovery, I refund your deposit.",
  },
  {
    question: "Can you guarantee results?",
    answer:
      "No one can guarantee conversion rates. What I guarantee: proven conversion principles (clear value prop, single CTA, trust signals), mobile-first execution, and 30 days post-launch support.",
  },
];

export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  // Initialiser Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "faq-cta" });
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
    itemsRef.current = [];

    const ctx = gsap.context(() => {
      const playAnimation = () => {
        const tl = gsap.timeline();

        // 1. Accordion container reveal
        tl.fromTo(
          accordionContainerRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
        );

        // 2. Items en stagger (après le container)
        itemsRef.current.forEach((item, index) => {
          if (!item) return;

          tl.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            },
            0.3 + index * 0.12, // Commence 0.3s après début + stagger
          );
        });

        // 3. Micro-CTA à la fin
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2", // Overlap avec dernier item
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
              accordionContainerRef.current,
              ...itemsRef.current,
              ctaRef.current,
            ],
            { clearProps: "all" },
          );
        },
        onLeaveBack: () => {
          gsap.set(
            [
              accordionContainerRef.current,
              ...itemsRef.current,
              ctaRef.current,
            ],
            { clearProps: "all" },
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section header avec animation lettre par lettre */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
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
            {"FAQ".split("").map((char, i) => (
              <motion.span
                key={`title-${i}`}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Accordion container */}
        <div ref={accordionContainerRef} className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                ref={(el) => {
                  if (el) itemsRef.current[index] = el;
                }}
              >
                <AccordionTrigger className="text-left text-lg font-semibold transition-colors hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Micro-CTA */}
          <div ref={ctaRef} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Still have questions?{" "}
              <a
                href="#"
                className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                data-cal-namespace="faq-cta"
                data-cal-link="franck-zinsou-0odrm8/audit"
                data-cal-config='{"layout":"column_view"}'
              >
                Book a 15-min call
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
