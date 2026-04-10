import { NormalizedCandle } from "@/core/market-data/types";

export function validateCandle(c: NormalizedCandle): boolean {
  if (![c.open, c.high, c.low, c.close, c.volume].every(Number.isFinite)) return false;
  if (c.high < Math.max(c.open, c.close)) return false;
  if (c.low > Math.min(c.open, c.close)) return false;
  if (c.volume < 0) return false;
  return true;
}

export function dedupeAndSortCandles(candles: NormalizedCandle[]) {
  const map = new Map<string, NormalizedCandle>();
  for (const c of candles) map.set(`${c.symbol}:${c.timeframe}:${c.ts}`, c);
  return [...map.values()].sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
}
