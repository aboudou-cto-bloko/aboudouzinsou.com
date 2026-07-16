import { prisma } from "./events";

export async function getStats(slug: string): Promise<{ views: number; likes: number }> {
  const row = await prisma.postStat.findUnique({ where: { slug } });
  return { views: row?.views ?? 0, likes: row?.likes ?? 0 };
}

export async function incrementViews(slug: string): Promise<number> {
  const row = await prisma.postStat.upsert({
    where: { slug },
    create: { slug, views: 1 },
    update: { views: { increment: 1 } },
  });
  return row.views;
}

export async function toggleLike(
  slug: string,
  action: "like" | "unlike"
): Promise<number> {
  const delta = action === "like" ? 1 : -1;
  const row = await prisma.postStat.upsert({
    where: { slug },
    create: { slug, likes: Math.max(0, delta) },
    update: { likes: { increment: delta } },
  });

  if (row.likes < 0) {
    const fixed = await prisma.postStat.update({
      where: { slug },
      data: { likes: 0 },
    });
    return fixed.likes;
  }

  return row.likes;
}

export async function getAllStats(): Promise<
  Record<string, { views: number; likes: number }>
> {
  const rows = await prisma.postStat.findMany();
  const out: Record<string, { views: number; likes: number }> = {};
  for (const row of rows) {
    out[row.slug] = { views: row.views, likes: row.likes };
  }
  return out;
}

export async function subscribeEmail(
  email: string,
  source = "site"
): Promise<"ok" | "exists" | "error"> {
  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) return "exists";
    await prisma.subscriber.create({ data: { email, source } });
    return "ok";
  } catch {
    return "error";
  }
}
