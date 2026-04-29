"use client";
import { useState } from "react";
import { Link2, Check, Linkedin } from "lucide-react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = () => {
    const u = encodeURIComponent(window.location.href);
    const t = encodeURIComponent(title);
    window.open(`https://x.com/intent/tweet?url=${u}&text=${t}`, "_blank", "noopener");
  };

  const shareLI = () => {
    const u = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`, "_blank", "noopener");
  };

  return (
    <div className="share-row" aria-label="Partager cet article">
      <button onClick={copy} className="share-btn" aria-label="Copier le lien">
        {copied ? <Check size={12} /> : <Link2 size={12} />}
        <span>{copied ? "Copié !" : "Copier le lien"}</span>
      </button>
      <button onClick={shareX} className="share-btn" aria-label="Partager sur X">
        <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>X</span>
      </button>
      <button onClick={shareLI} className="share-btn" aria-label="Partager sur LinkedIn">
        <Linkedin size={12} />
        <span>LinkedIn</span>
      </button>
    </div>
  );
}
