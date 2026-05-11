"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function KitForm() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        router.push("/kit/merci");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="newsletter-modal__form" style={{ maxWidth: "400px" }}>
        <input
          type="email"
          placeholder="ton@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="newsletter-modal__input"
          autoComplete="email"
          disabled={status === "loading"}
          style={{ borderRadius: 0 }}
        />
        <button
          type="submit"
          className="newsletter-modal__submit"
          disabled={status === "loading"}
          style={{ borderRadius: 0, minWidth: "80px", letterSpacing: "0.02em" }}
        >
          {status === "loading" ? "…" : "Recevoir →"}
        </button>
      </form>

      {status === "error" && (
        <p style={{ fontSize: "var(--text-xs)", color: "#c0392b", marginTop: "0.5rem" }}>
          Une erreur est survenue. Réessaie.
        </p>
      )}

      <p style={{ fontSize: "0.75rem", color: "#444", marginTop: "0.5rem", fontFamily: "var(--font-mono)" }}>
        Accès immédiat. Pas de spam.
      </p>
    </div>
  );
}
