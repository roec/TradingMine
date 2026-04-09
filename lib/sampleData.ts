import { Candle, SymbolMeta } from "@/core/types/domain";

export const sampleSymbols: SymbolMeta[] = [
  { id: "1", ticker: "600519", name: "Kweichow Moutai", exchange: "SSE", sector: "Consumer", industry: "Liquor" },
  { id: "2", ticker: "000001", name: "Ping An Bank", exchange: "SZSE", sector: "Financial", industry: "Bank" },
  { id: "3", ticker: "300750", name: "CATL", exchange: "SZSE", sector: "Industrial", industry: "Battery" }
];

export function generateCandles(symbol: string, length = 260): Candle[] {
  const candles: Candle[] = [];
  let price = 20 + (Number(symbol.slice(-2)) % 50);
  for (let i = 0; i < length; i += 1) {
    const drift = Math.sin(i / 12) * 0.4 + (i > 180 ? -0.12 : 0.18);
    const noise = Math.sin(i / 5 + symbol.length) * 0.8;
    const open = price;
    const close = Math.max(2, open * (1 + (drift + noise) / 100));
    const high = Math.max(open, close) * (1 + Math.abs(noise) / 100);
    const low = Math.min(open, close) * (1 - Math.abs(noise) / 100);
    const volume = 30_000_000 + (Math.sin(i / 7) + 1) * 9_000_000 + (i > 200 ? 8_000_000 : 0);
    candles.push({
      symbol,
      timestamp: new Date(Date.UTC(2024, 0, i + 1)).toISOString(),
      open,
      high,
      low,
      close,
      volume
    });
    price = close;
  }
  return candles;
}

export const sampleCandles: Record<string, Candle[]> = Object.fromEntries(
  sampleSymbols.map((s) => [s.ticker, generateCandles(s.ticker)])
);
