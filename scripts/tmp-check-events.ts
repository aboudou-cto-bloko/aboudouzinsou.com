import { prisma } from "../lib/events";

async function main() {
  const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
  console.log(`Total événements en base: ${events.length}`);
  for (const e of events) {
    console.log(`  [${e.createdAt.toISOString()}] ${e.name} — ${e.path} — session=${e.sessionId}`);
  }
}
main().finally(() => prisma.$disconnect());
