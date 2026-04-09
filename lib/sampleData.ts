import { Candle, SymbolMeta } from "@/core/types/domain";

export const sampleSymbols: SymbolMeta[] = [
  { id: "1", ticker: "AAPL", name: "Apple", exchange: "NASDAQ", sector: "Tech", industry: "Hardware" },
  { id: "2", ticker: "MSFT", name: "Microsoft", exchange: "NASDAQ", sector: "Tech", industry: "Software" },
  { id: "3", ticker: "NVDA", name: "NVIDIA", exchange: "NASDAQ", sector: "Tech", industry: "Semiconductors" }
];

export function generateCandles(symbol: string, length = 260): Candle[] {
  const candles: Candle[] = [];
  let price = 100 + symbol.charCodeAt(0) % 50;
  for (let i = 0; i < length; i += 1) {
    const drift = Math.sin(i / 12) * 0.4 + (i > 180 ? -0.15 : 0.2);
    const noise = Math.sin(i / 5 + symbol.length) * 0.8;
    const open = price;
    const close = Math.max(5, open * (1 + (drift + noise) / 100));
    const high = Math.max(open, close) * (1 + Math.abs(noise) / 100);
    const low = Math.min(open, close) * (1 - Math.abs(noise) / 100);
    const volume = 1_000_000 + (Math.sin(i / 7) + 1) * 300_000 + (i > 200 ? 200_000 : 0);
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
