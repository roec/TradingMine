import { runScreener } from "@/core/screening/engine";
import { strategyTemplates } from "@/core/strategies/engine";
import { sampleSymbols } from "@/lib/sampleData";
import { buildLatestRow } from "@/lib/analytics";
import { runBacktest } from "@/core/backtest/engine";
import { getUniverseCandles } from "@/lib/market-data";

export async function getUniverseRows() {
  const symbols = sampleSymbols.map((s) => s.ticker);
  const candlesBySymbol = await getUniverseCandles(symbols);
  return symbols.map((symbol) => ({ symbol, ...buildLatestRow(candlesBySymbol[symbol]) }));
}

export async function getDashboardData() {
  const symbols = sampleSymbols.map((s) => s.ticker);
  const candlesBySymbol = await getUniverseCandles(symbols);
  const rows = symbols.map((symbol) => ({ symbol, ...buildLatestRow(candlesBySymbol[symbol]) }));
  const risky = [...rows].sort((a, b) => b.TopExitScore - a.TopExitScore);
  const opportunities = runScreener(rows, [
    { indicator: "HighPos", op: ">", value: 0.8 },
    { indicator: "TopExitScore", op: "<", value: 0.4 },
    { indicator: "close_above_ma20", op: "=", value: true },
    { indicator: "close_above_ma60", op: "=", value: true }
  ]);

  const backtest = runBacktest({
    candlesBySymbol,
    rowsBySymbol: Object.fromEntries(
      Object.entries(candlesBySymbol).map(([symbol, candles]) => [
        symbol,
        candles.map((_, i) => buildLatestRow(candles.slice(0, i + 1)))
      ])
    ),
    strategy: strategyTemplates[0],
    initialCapital: 100000,
    feeBps: 5,
    slippageBps: 3,
    maxConcurrentPositions: 3
  });

  return {
    marketOverview: rows,
    topRiskSignals: risky.slice(0, 5),
    screened: opportunities,
    strategySnapshot: backtest.metrics,
    recentInsights: [
      "Distribution pressure is rising in high-beta names.",
      "Momentum signals are strongest in semiconductors.",
      "TopExitScore cluster below 0.4 suggests trend continuation."
    ]
  };
}
