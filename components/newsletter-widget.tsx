"use client";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterWidget() {
  const [subscribed, setSubscribed] = useState(true); // default hidden until hydrated

  useEffect(() => {
    setSubscribed(!!localStorage.getItem("nw_sub"));
    const onSub = () => setSubscribed(true);
    window.addEventListener("open-newsletter", onSub);
    return () => window.removeEventListener("open-newsletter", onSub);
  }, []);

  if (subscribed) return null;

  return (
    <button
      className="newsletter-widget"
      aria-label="S'inscrire à la newsletter"
      onClick={() => window.dispatchEvent(new CustomEvent("open-newsletter"))}
    >
      <Mail size={12} strokeWidth={1.5} />
      <span>Newsletter</span>
    </button>
  );
}
