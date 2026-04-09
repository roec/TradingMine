import { NextResponse } from "next/server";
import { sampleCandles } from "@/lib/sampleData";
import { buildLatestRow } from "@/lib/analytics";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const candles = sampleCandles[ticker.toUpperCase()] || [];
  return NextResponse.json({ symbol: ticker.toUpperCase(), latest: buildLatestRow(candles), candles });
}
