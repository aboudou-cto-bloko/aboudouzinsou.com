import { NextRequest, NextResponse } from "next/server";
import { getStats, toggleLike } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { likes } = await getStats(slug);
  return NextResponse.json({ slug, count: likes });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const action: "like" | "unlike" = body.action === "unlike" ? "unlike" : "like";
  const count = await toggleLike(slug, action);
  return NextResponse.json({ slug, count });
}
