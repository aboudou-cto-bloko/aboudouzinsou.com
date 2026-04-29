import { NextRequest, NextResponse } from "next/server";
import { getViewCount, incrementView } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return NextResponse.json({ slug, count: getViewCount(slug) });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return NextResponse.json({ slug, count: incrementView(slug) });
}
