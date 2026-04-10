import { redis } from "@/lib/redis";
import { dedupeAndSortCandles, validateCandle } from "@/core/market-data/normalizers";
import { DataFreshness, NormalizedCandle, RealtimeQuoteSnapshot } from "@/core/market-data/types";
import { getActiveProviderName, providerRegistry } from "@/core/market-data/providerRegistry";
import { getMarketSession } from "@/core/china/marketRules";

const CANDLE_TTL = 90;
const SNAPSHOT_TTL = 30;

function nowIso() {
  return new Date().toISOString();
}

function resolveFreshness(ts: string): DataFreshness {
  const delta = Date.now() - new Date(ts).getTime();
  if (delta < 90_000) return "LIVE";
  if (delta < 300_000) return "DELAYED";
  if (delta < 1_800_000) return "STALE";
  return "UNAVAILABLE";
}

export async function fetchAndCacheRealtime(params: { symbols: string[]; timeframe: "1m" | "5m" | "15m" | "30m" | "60m" }) {
  const providerName = getActiveProviderName();
  const provider = providerRegistry[providerName];

  const rawCandles = await provider.getMinuteCandles(params);
  const candles = dedupeAndSortCandles(rawCandles).filter(validateCandle);

  for (const symbol of params.symbols) {
    const perSymbol = candles.filter((c) => c.symbol === symbol);
    if (perSymbol.length === 0) continue;
    const key = `realtime:candles:${params.timeframe}:${symbol}`;
    await redis.set(key, JSON.stringify(perSymbol.slice(-300)), { EX: CANDLE_TTL });
  }

  if (provider.getRealtimeSnapshot) {
    const snaps = await provider.getRealtimeSnapshot({ symbols: params.symbols });
    for (const snap of snaps) {
      await redis.set(`realtime:snapshot:${snap.symbol}`, JSON.stringify(snap), { EX: SNAPSHOT_TTL });
    }
  }

  await redis.set(
    "market:session:state",
    JSON.stringify({ ts: nowIso(), session: getMarketSession(new Date(), "SSE"), provider: providerName }),
    { EX: 120 }
  );

  return { providerName, candlesCount: candles.length, symbols: params.symbols.length, ts: nowIso() };
}

export async function getCachedCandles(symbol: string, timeframe: "1m" | "5m" | "15m" | "30m" | "60m") {
  const raw = await redis.get(`realtime:candles:${timeframe}:${symbol}`);
  const candles = raw ? (JSON.parse(raw) as NormalizedCandle[]) : [];
  const freshness = candles.length ? resolveFreshness(candles[candles.length - 1].ts) : "UNAVAILABLE";
  return { candles, freshness };
}

export async function getCachedSnapshot(symbol: string) {
  const raw = await redis.get(`realtime:snapshot:${symbol}`);
  const snapshot = raw ? (JSON.parse(raw) as RealtimeQuoteSnapshot) : null;
  const freshness = snapshot ? resolveFreshness(snapshot.ts) : "UNAVAILABLE";
  return { snapshot, freshness };
}
