import { NextResponse } from "next/server";
import { fetchAndCacheRealtime } from "@/core/market-data/marketDataService";

export async function POST(req: Request) {
  const body = await req.json();
  const symbol = body.symbol || "600519.SH";
  const result = await fetchAndCacheRealtime({ symbols: [symbol], timeframe: "1m" });
  return NextResponse.json(result);
}
