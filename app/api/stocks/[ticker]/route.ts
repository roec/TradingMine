import { NextResponse } from "next/server";
import { sampleCandles } from "@/lib/sampleData";
import { buildLatestRow } from "@/lib/analytics";

export async function GET(_req: Request, { params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase();
  const candles = sampleCandles[ticker] || sampleCandles.AAPL;
  return NextResponse.json({ symbol: ticker, latest: buildLatestRow(candles), candles });
}
