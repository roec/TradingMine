import { NextResponse } from "next/server";
import { runBacktest } from "@/core/backtest/engine";
import { strategyTemplates } from "@/core/strategies/engine";
import { sampleCandles } from "@/lib/sampleData";
import { buildLatestRow } from "@/lib/analytics";

export async function POST() {
  const rowsBySymbol = Object.fromEntries(
    Object.entries(sampleCandles).map(([s, candles]) => [s, candles.map((_, i) => buildLatestRow(candles.slice(0, i + 1)))])
  );
  const result = runBacktest({
    candlesBySymbol: sampleCandles,
    rowsBySymbol,
    strategy: strategyTemplates[0],
    initialCapital: 100000,
    feeBps: 5,
    slippageBps: 3,
    maxConcurrentPositions: 3
  });
  return NextResponse.json(result);
}
