import { NextResponse } from "next/server";
import { getCachedSnapshot } from "@/core/market-data/marketDataService";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get("symbol") || "600519.SH").toUpperCase();
  const result = await getCachedSnapshot(symbol);
  return NextResponse.json(result);
}
