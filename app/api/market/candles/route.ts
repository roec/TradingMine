import { NextResponse } from "next/server";
import { getCachedCandles } from "@/core/market-data/marketDataService";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get("symbol") || "600519.SH").toUpperCase();
  const timeframe = (url.searchParams.get("timeframe") || "1m") as "1m" | "5m" | "15m" | "30m" | "60m";
  const result = await getCachedCandles(symbol, timeframe);
  return NextResponse.json(result);
}
