import { NextResponse } from "next/server";
import { buildLatestRow } from "@/lib/analytics";
import { getCandles } from "@/lib/market-data";
import { fetchChinaRealtimeQuote } from "@/lib/china-market-data";

export async function GET(_req: Request, context: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await context.params;
  const normalizedTicker = ticker.toUpperCase();
  const candles = await getCandles(normalizedTicker);

  let realtime = null;
  if ((process.env.MARKET || "CN_A_SHARE") === "CN_A_SHARE") {
    try {
      realtime = await fetchChinaRealtimeQuote(normalizedTicker);
    } catch {
      realtime = null;
    }
  }

  return NextResponse.json({ symbol: normalizedTicker, latest: buildLatestRow(candles), candles, realtime });
}
