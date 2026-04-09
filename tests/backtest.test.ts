import { describe, expect, it } from "vitest";
import { runBacktest } from "@/core/backtest/engine";
import { strategyTemplates } from "@/core/strategies/engine";
import { generateCandles } from "@/lib/sampleData";
import { buildLatestRow } from "@/lib/analytics";

describe("backtest", () => {
  it("generates metrics and curve", () => {
    const candles = { AAPL: generateCandles("AAPL", 120) };
    const rows = {
      AAPL: candles.AAPL.map((_, i) => buildLatestRow(candles.AAPL.slice(0, i + 1)))
    };
    const result = runBacktest({
      candlesBySymbol: candles,
      rowsBySymbol: rows,
      strategy: strategyTemplates[0],
      initialCapital: 10000,
      feeBps: 5,
      slippageBps: 3,
      maxConcurrentPositions: 1
    });
    expect(result.equityCurve.length).toBe(120);
    expect(result.metrics.totalReturn).toBeTypeOf("number");
  });
});
