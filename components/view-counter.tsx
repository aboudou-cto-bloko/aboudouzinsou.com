"use client";
import { useEffect, useState } from "react";

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, [slug]);

  if (count === null) return null;

  return (
    <span className="badge badge--views" aria-label={`${count} vues`}>
      {fmt(count)} vue{count !== 1 ? "s" : ""}
    </span>
  );
}
