import { NextResponse } from "next/server";
import { buildLatestRow } from "@/lib/analytics";
import { getCandles } from "@/lib/market-data";

export async function GET(_req: Request, context: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await context.params;
  const normalizedTicker = ticker.toUpperCase();
  const candles = await getCandles(normalizedTicker);
  return NextResponse.json({ symbol: normalizedTicker, latest: buildLatestRow(candles), candles });
}
