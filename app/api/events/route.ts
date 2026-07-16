import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

const EVENT_NAMES = [
  "page_view",
  "whatsapp_click",
  "mailto_click",
  "newsletter_signup",
] as const;

const bodySchema = z.object({
  name: z.enum(EVENT_NAMES),
  path: z.string().max(500),
  referrer: z.string().max(500).nullish(),
  utmSource: z.string().max(100).nullish(),
  utmMedium: z.string().max(100).nullish(),
  utmCampaign: z.string().max(100).nullish(),
  sessionId: z.string().min(1).max(100),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await logEvent(parsed.data);
  } catch {
    // On ne bloque jamais l'UX du visiteur pour un événement analytique perdu.
  }

  return NextResponse.json({ ok: true });
}
