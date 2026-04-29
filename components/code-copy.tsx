"use client";
import { useEffect } from "react";

export function CopyCodeButtons() {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".prose pre").forEach((pre) => {
      if (pre.querySelector("[data-copy]")) return;
      const code = pre.querySelector("code");
      if (!code) return;

      const btn = document.createElement("button");
      btn.setAttribute("data-copy", "");
      btn.textContent = "Copier";

      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          btn.textContent = "Copié";
          btn.setAttribute("data-copied", "");
        } catch {
          btn.textContent = "Erreur";
        }
        setTimeout(() => {
          btn.textContent = "Copier";
          btn.removeAttribute("data-copied");
        }, 1500);
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}
