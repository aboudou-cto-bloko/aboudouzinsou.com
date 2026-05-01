"use client";
import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%-_+=<>|/?";
const PASSTHROUGH = new Set([" ", "'", ".", ",", "·", "-", ":", "/"]);

type Options = {
  speed?: number;   // ms per tick
  stagger?: number; // ticks to wait between each char start
  cycles?: number;  // random ticks per char before reveal
};

export function useScramble(
  text: string,
  trigger: boolean,
  { speed = 35, stagger = 3, cycles = 6 }: Options = {}
) {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(reduced ? text : "");
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalId.current) clearInterval(intervalId.current);

    if (reduced || !trigger) {
      setOutput(text);
      return;
    }

    setOutput("");
    let tick = 0;
    const len = text.length;

    intervalId.current = setInterval(() => {
      tick++;

      const next = text
        .split("")
        .map((char, i) => {
          const startTick = i * stagger;
          const revealTick = startTick + cycles;
          if (tick <= startTick) return " ";
          if (tick > revealTick) return char;
          if (PASSTHROUGH.has(char)) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setOutput(next);

      if (tick > (len - 1) * stagger + cycles) {
        clearInterval(intervalId.current!);
        setOutput(text);
      }
    }, speed);

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [text, trigger, reduced, speed, stagger, cycles]);

  return output;
}
