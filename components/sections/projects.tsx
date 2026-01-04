"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Dynamic GSAP import (desktop only)
const loadGSAP = async () => {
  if (typeof window === "undefined" || window.innerWidth < 768) return null;
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
};

const featuredProject = {
  title: "VaultPay",
  type: "Fintech SaaS • Landing Page",
  heroImage: "/featured-screenshot.png",
  heroImageWebP: "/featured-screenshot.webp",
  heroImageMobile: "/featured-screenshot.jpg",
  heroImageMobileWebP: "/featured-screenshot.webp",
  challenge:
    "Pre-launch fintech needed 10,000 waitlist signups. Previous site: 4.6% conversion, amateur look, broken mobile experience.",
  solution:
    "Positioned against Western Union (1.5% vs 8-12% fees). Mobile-first design with licensing badges and real testimonials. Built in 3 weeks with Next.js + Tailwind.",
  link: "https://vaultpay-landing.vercel.app/",
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

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const conceptsRef = useRef<(HTMLDivElement | null)[]>([]);

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
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
      );

      if (featuredRef.current) observer.observe(featuredRef.current);
      conceptsRef.current.forEach((el) => el && observer.observe(el));

      return () => observer.disconnect();
    }

    // Desktop: GSAP lazy loaded
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
            // Featured project
            if (featuredRef.current) {
              gsap.fromTo(
                featuredRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
              );

              const elements = [
                featuredRef.current.querySelector(".project-type"),
                featuredRef.current.querySelector(".project-title"),
                featuredRef.current.querySelector(".project-challenge"),
                featuredRef.current.querySelector(".project-solution"),
                featuredRef.current.querySelector(".project-link"),
              ];

              gsap.fromTo(
                elements.filter(Boolean),
                { opacity: 0, y: 20 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.1,
                  ease: "power2.out",
                  delay: 0.2,
                },
              );
            }

            // Concept projects
            gsap.fromTo(
              conceptsRef.current.filter(Boolean),
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.4,
              },
            );
          },
        });
      }, sectionRef);
    });

    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-muted/30 py-16 lg:py-24">
      <div className="container mx-auto px-6">
        {/* Section header - CSS animations only */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2 className="animate-fade-in text-3xl font-bold tracking-tight sm:text-4xl">
            Recent Work
          </h2>
          <p className="animate-fade-in-delay mt-4 text-lg leading-relaxed text-muted-foreground">
            One real project. Two concept demonstrations. All
            conversion-focused.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Featured project - VaultPay */}
          <Card
            ref={featuredRef}
            className="mobile-fade-target group overflow-hidden transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-xl lg:row-span-2"
          >
            {/* Hero Image - Optimized LCP */}
            <div className="relative aspect-[1920/962] w-full overflow-hidden rounded-lg bg-muted shadow-sm">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={featuredProject.heroImageMobileWebP}
                  type="image/webp"
                />
                <source
                  media="(min-width: 768px)"
                  srcSet={featuredProject.heroImageWebP}
                  type="image/webp"
                />
                <source
                  media="(max-width: 767px)"
                  srcSet={featuredProject.heroImageMobile}
                  type="image/jpeg"
                />
                <img
                  src={featuredProject.heroImage}
                  alt={featuredProject.title}
                  fetchPriority="high"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                  width="1920"
                  height="962"
                />
              </picture>
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-background/60 to-transparent" />
            </div>

            <CardHeader className="space-y-4">
              {/* Type tag */}
              <div className="project-type w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {featuredProject.type}
              </div>

              {/* Title */}
              <h3 className="project-title text-3xl font-bold transition-colors duration-300 md:group-hover:text-primary">
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
                conceptsRef.current[index] = el;
              }}
              className="mobile-fade-target group transition-all duration-300 md:hover:-translate-y-2 md:hover:shadow-lg"
            >
              <CardHeader className="space-y-3">
                {/* Type tag */}
                <div className="concept-type w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {project.type}
                </div>

                {/* Title */}
                <h3 className="concept-title text-2xl font-semibold transition-colors duration-300 md:group-hover:text-primary">
                  {project.title}
                </h3>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="concept-description text-sm leading-relaxed text-muted-foreground transition-colors duration-300 md:group-hover:text-foreground">
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
