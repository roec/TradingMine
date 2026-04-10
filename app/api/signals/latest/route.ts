import { NextResponse } from "next/server";
import { getCandles } from "@/lib/market-data";
import { buildLatestRow } from "@/lib/analytics";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get("symbol") || "600519").toUpperCase();
  const candles = await getCandles(symbol);
  const latest = buildLatestRow(candles);
  return NextResponse.json({ symbol, latest, ts: new Date().toISOString() });
}
