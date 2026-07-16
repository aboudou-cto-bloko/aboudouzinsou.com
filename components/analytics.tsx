"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/track";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    track("page_view");
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("https://wa.me/")) {
        track("whatsapp_click", { href });
      } else if (href.startsWith("mailto:")) {
        track("mailto_click", { href });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
