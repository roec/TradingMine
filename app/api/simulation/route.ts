import { NextResponse } from "next/server";
import { getUniverseRows } from "@/lib/service";

export async function POST() {
  const ranked = getUniverseRows().sort((a, b) => b.ret20 - a.ret20);
  return NextResponse.json({ rebalance: "weekly", topRankedSymbols: ranked.slice(0, 5) });
}
