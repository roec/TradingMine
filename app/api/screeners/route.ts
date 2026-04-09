import { NextResponse } from "next/server";
import { getUniverseRows } from "@/lib/service";
import { runScreener } from "@/core/screening/engine";

export async function POST(req: Request) {
  const body = await req.json();
  const rows = getUniverseRows();
  const results = runScreener(rows, body.conditions || []);
  return NextResponse.json({ results });
}
