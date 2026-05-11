import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email?: string };
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    const result = await subscribeEmail(email.toLowerCase().trim(), "kit");
    if (result === "error") return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
