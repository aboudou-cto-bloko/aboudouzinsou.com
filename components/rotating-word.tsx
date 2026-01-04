"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RotatingWordProps {
  words: string[];
  className?: string;
}

export function RotatingWord({ words, className }: RotatingWordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    let tl: gsap.core.Timeline | null = null;

    // Fonction pour démarrer l'animation
    const startAnimation = () => {
      if (tl) tl.kill();

      // Reset position
      gsap.set(container, { rotationX: 0 });

      tl = gsap.timeline({
        repeat: -1,
      });

      // Animation de chaque mot avec pause
      words.forEach((_, index) => {
        const targetRotation = -(index * 90);
        tl!
          .to(container, {
            rotationX: targetRotation,
            duration: 0.8,
            ease: "power2.inOut",
          })
          .to({}, { duration: 2 }); // Pause de 2s
      });

      // Retour fluide au début
      tl.to(container, {
        rotationX: -360,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(container, { rotationX: 0 });
        },
      });
    };

    // ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => {
        setIsInView(true);
        startAnimation();
      },
      onEnterBack: () => {
        setIsInView(true);
        startAnimation();
      },
      onLeave: () => {
        setIsInView(false);
        if (tl) {
          tl.kill();
          gsap.set(container, { rotationX: 0 });
        }
      },
      onLeaveBack: () => {
        setIsInView(false);
        if (tl) {
          tl.kill();
          gsap.set(container, { rotationX: 0 });
        }
      },
    });

    return () => {
      if (tl) tl.kill();
      trigger.kill();
    };
  }, [words]);

  // Calcul largeur du mot le plus long
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block align-baseline"
      style={{
        perspective: "2000px",
        height: "0.9em", //
        width: `${longestWord.length * 0.6}em`,
        verticalAlign: "baseline", //
        display: "inline-block",
        marginLeft: "0.1em",
        marginRight: "0.05em",
      }}
    >
      <span
        ref={containerRef}
        style={{
          transformStyle: "preserve-3d",
          display: "block",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          transformOrigin: "center center",
          width: "100%",
        }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            className={`rotating-word-item ${className}`}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotateX(${index * 90}deg) translateZ(0.6em)`, // ✅ translateZ augmenté
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              display: "block",
              whiteSpace: "nowrap",
            }}
          >
            {word}
            <span className="inline-block">.</span>
          </span>
        ))}
      </span>
    </span>
  );
}
