import { NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json() as { email?: string; source?: string };
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    const result = await subscribeEmail(email.toLowerCase().trim(), source ?? "site");
    if (result === "error") return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    return NextResponse.json({ ok: true, already: result === "exists" });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
