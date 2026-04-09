import { Candle } from "@/core/types/domain";
import { sampleCandles } from "@/lib/sampleData";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "NVDA"];

function stooqSymbol(ticker: string) {
  return `${ticker.toLowerCase()}.us`;
}

function parseStooqCsv(ticker: string, csv: string): Candle[] {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  return lines
    .slice(1)
    .map((line) => line.split(","))
    .filter((row) => row.length >= 6 && row[1] !== "N/D")
    .map((row) => {
      const [date, open, high, low, close, volume] = row;
      return {
        symbol: ticker,
        timestamp: new Date(`${date}T00:00:00.000Z`).toISOString(),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume)
      } satisfies Candle;
    })
    .filter((c) => Number.isFinite(c.close) && c.close > 0);
}

export async function fetchCandlesFromStooq(ticker: string): Promise<Candle[]> {
  const response = await fetch(`https://stooq.com/q/d/l/?s=${stooqSymbol(ticker)}&i=d`, {
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Stooq request failed: ${response.status}`);
  }
  const csv = await response.text();
  return parseStooqCsv(ticker, csv);
}

export async function getCandles(ticker: string): Promise<Candle[]> {
  const mode = process.env.MARKET_DATA_MODE || "live";
  if (mode === "mock") {
    return sampleCandles[ticker] || sampleCandles.AAPL;
  }

  try {
    const candles = await fetchCandlesFromStooq(ticker);
    if (candles.length > 30) return candles;
  } catch (error) {
    console.warn(`Failed to fetch live data for ${ticker}, fallback to mock data.`, error);
  }

  return sampleCandles[ticker] || sampleCandles.AAPL;
}

export async function getUniverseCandles(symbols: string[] = DEFAULT_SYMBOLS) {
  const entries = await Promise.all(symbols.map(async (symbol) => [symbol, await getCandles(symbol)] as const));
  return Object.fromEntries(entries);
}
