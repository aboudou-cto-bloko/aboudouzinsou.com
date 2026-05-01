"use client";
import { useRef, useState, useEffect, ElementType, ComponentPropsWithoutRef } from "react";
import { useScramble } from "@/hooks/use-scramble";

type Props<T extends ElementType = "span"> = {
  text: string;
  as?: T;
  triggerOnMount?: boolean;
  delay?: number;
  speed?: number;
  stagger?: number;
  cycles?: number;
} & Omit<ComponentPropsWithoutRef<T>, "children">;

export function ScrambleText<T extends ElementType = "span">({
  text,
  as,
  triggerOnMount = false,
  delay = 0,
  speed,
  stagger,
  cycles,
  ...props
}: Props<T>) {
  const Tag = (as ?? "span") as ElementType;
  const ref = useRef<Element>(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (triggerOnMount) {
      timer = setTimeout(() => setTrigger(true), delay);
      return () => clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setTrigger(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [triggerOnMount, delay]);

  const output = useScramble(text, trigger, { speed, stagger, cycles });

  return (
    <Tag ref={ref} aria-label={text} {...props}>
      {output}
    </Tag>
  );
}
