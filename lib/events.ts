import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// Singleton pattern requis en dev (Next.js recharge les modules à chaud,
// ce qui créerait une nouvelle connexion Postgres à chaque sauvegarde de fichier).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type TrackedEvent = {
  name: string;
  path: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  sessionId: string;
  meta?: Record<string, unknown>;
};

export async function logEvent(event: TrackedEvent): Promise<void> {
  await prisma.event.create({
    data: {
      name: event.name,
      path: event.path,
      referrer: event.referrer ?? null,
      utmSource: event.utmSource ?? null,
      utmMedium: event.utmMedium ?? null,
      utmCampaign: event.utmCampaign ?? null,
      sessionId: event.sessionId,
      meta: event.meta as never,
    },
  });
}

export type EventSummary = {
  totalEvents: number;
  uniqueSessions: number;
  byName: { name: string; count: number }[];
  byPath: { path: string; count: number }[];
  byDay: { day: string; count: number }[];
  recent: {
    id: string;
    name: string;
    path: string;
    referrer: string | null;
    meta: unknown;
    createdAt: Date;
  }[];
};

export async function getEventSummary(sinceDays = 30): Promise<EventSummary> {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);

  const [totalEvents, sessions, byNameRaw, byPathRaw, recent] = await Promise.all([
    prisma.event.count({ where: { createdAt: { gte: since } } }),
    prisma.event.findMany({
      where: { createdAt: { gte: since } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    prisma.event.groupBy({
      by: ["name"],
      where: { createdAt: { gte: since } },
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
    }),
    prisma.event.groupBy({
      by: ["path"],
      where: { createdAt: { gte: since } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 20,
    }),
    prisma.event.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, name: true, path: true, referrer: true, meta: true, createdAt: true },
    }),
  ]);

  const byDayRaw = await prisma.$queryRaw<{ day: string; count: bigint }[]>`
    SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') as day, COUNT(*)::bigint as count
    FROM "Event"
    WHERE "createdAt" >= ${since}
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  return {
    totalEvents,
    uniqueSessions: sessions.length,
    byName: byNameRaw.map((r) => ({ name: r.name, count: r._count.name })),
    byPath: byPathRaw.map((r) => ({ path: r.path, count: r._count.path })),
    byDay: byDayRaw.map((r) => ({ day: r.day, count: Number(r.count) })),
    recent,
  };
}
