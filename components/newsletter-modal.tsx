"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { track } from "@/lib/track";

const KEY_SUB     = "nw_sub";
const KEY_DISMISS = "nw_hide";
const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000;
const TIME_TRIGGER_S = 80;

function canShow(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem(KEY_SUB)) return false;
  const d = localStorage.getItem(KEY_DISMISS);
  if (d && Date.now() - Number(d) < DISMISS_TTL) return false;
  return true;
}

export function NewsletterModal() {
  const [open, setOpen]     = useState(false);
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const fired = useRef(false);

  const fire = () => {
    if (fired.current || !canShow()) return;
    fired.current = true;
    setTimeout(() => setOpen(true), 900);
  };

  useEffect(() => {
    // ① Scroll trigger — sentinel placed in article footer
    const sentinel = document.querySelector("[data-newsletter-trigger]");
    let obs: IntersectionObserver | null = null;
    if (sentinel) {
      obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) fire(); }, { threshold: 0.4 });
      obs.observe(sentinel);
    }

    // ② Time trigger — 80 s of visible reading
    let elapsed = 0;
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") {
        elapsed++;
        if (elapsed >= TIME_TRIGGER_S) { fire(); clearInterval(iv); }
      }
    }, 1000);

    // ③ Widget custom event
    const onWidget = () => { if (canShow()) setOpen(true); };
    window.addEventListener("open-newsletter", onWidget);

    return () => { obs?.disconnect(); clearInterval(iv); window.removeEventListener("open-newsletter", onWidget); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dismiss = () => {
    localStorage.setItem(KEY_DISMISS, String(Date.now()));
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "modal" }),
      });
      if (res.ok) {
        setStatus("success");
        localStorage.setItem(KEY_SUB, "1");
        track("newsletter_signup", { source: "modal" });
        setTimeout(() => setOpen(false), 2800);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={dismiss}
          />
          <motion.div
            className="newsletter-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Inscription newsletter"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.96 }}
            transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button className="newsletter-modal__close" onClick={dismiss} aria-label="Fermer">
              <X size={13} />
            </button>

            {status === "success" ? (
              <div className="newsletter-modal__success">
                <p className="newsletter-modal__title">Bienvenue.</p>
                <p style={{ color: "#666", marginTop: "0.5rem", fontSize: "var(--text-sm)" }}>
                  À bientôt dans ta boîte.
                </p>
              </div>
            ) : (
              <>
                <p className="newsletter-modal__eyebrow">Tu arrives à la fin.</p>
                <p className="newsletter-modal__title">C&apos;est un bon signe.</p>
                <p className="newsletter-modal__body">
                  Inscris-toi pour recevoir les prochains articles directement dans ta boîte.
                  Un email à la fois, quand j&apos;ai quelque chose à dire.
                </p>
                <form onSubmit={submit} className="newsletter-modal__form">
                  <input
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="newsletter-modal__input"
                    autoComplete="email"
                  />
                  <button
                    type="submit"
                    className="newsletter-modal__submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "…" : "→"}
                  </button>
                </form>
                {status === "error" && (
                  <p style={{ fontSize: "var(--text-xs)", color: "#c0392b", marginTop: "0.5rem" }}>
                    Une erreur est survenue. Réessaie.
                  </p>
                )}
                <div className="newsletter-modal__footer">
                  <span>Pas de spam. Désabonnement facile.</span>
                  <button onClick={dismiss} className="newsletter-modal__skip">Pas maintenant</button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
