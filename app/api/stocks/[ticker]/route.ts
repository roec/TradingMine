import { NextResponse } from "next/server";
import { sampleCandles } from "@/lib/sampleData";
import { buildLatestRow } from "@/lib/analytics";

export async function GET(_req: Request, context: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await context.params;
  const normalizedTicker = ticker.toUpperCase();
  const candles = sampleCandles[normalizedTicker] || sampleCandles.AAPL;
  return NextResponse.json({ symbol: normalizedTicker, latest: buildLatestRow(candles), candles });
}
