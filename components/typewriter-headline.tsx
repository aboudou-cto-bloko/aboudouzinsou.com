"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useScramble } from "@/hooks/use-scramble";

const LINE1 = "Je construis.";

const PHRASES = [
  "J'écris ce que j'apprends.",
  "Je livre pour l'Afrique.",
  "Je pense en public.",
  "Je construis avec IA.",
  "Je partage ce qui marche.",
];

const TYPING_MS   = 52;
const DELETING_MS = 26;
const PAUSE_FULL  = 2600;
const PAUSE_EMPTY = 420;

export function TypewriterHeadline() {
  const reduced = useReducedMotion();
  const [text, setText]       = useState("");
  const [idx, setIdx]         = useState(0);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [scrambleTrigger, setScrambleTrigger] = useState(false);
  const line1 = useScramble(LINE1, scrambleTrigger, { speed: 38, stagger: 3, cycles: 7 });

  useEffect(() => {
    const t = setTimeout(() => setScrambleTrigger(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (reduced) { setText(PHRASES[0]); return; }

    const target = PHRASES[idx];
    const run = (fn: () => void, ms: number) => { timer.current = setTimeout(fn, ms); };

    if (!deleting && text === target) {
      run(() => setDeleting(true), PAUSE_FULL);
    } else if (deleting && text === "") {
      run(() => { setDeleting(false); setIdx((i) => (i + 1) % PHRASES.length); }, PAUSE_EMPTY);
    } else if (deleting) {
      run(() => setText((t) => t.slice(0, -1)), DELETING_MS);
    } else {
      run(() => setText(target.slice(0, text.length + 1)), TYPING_MS);
    }

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [text, idx, deleting, reduced]);

  return (
    <h1
      className="tagline-headline"
      aria-label={`${LINE1} ${reduced ? PHRASES[0] : (PHRASES[idx] || text)}`}
    >
      <span className="tagline-shimmer" aria-hidden="true">{reduced ? LINE1 : line1}</span>
      <br />
      <span className="tagline-shimmer">{reduced ? PHRASES[0] : text}</span>
      {!reduced && <span className="tagline-cursor" aria-hidden="true" />}
    </h1>
  );
}
