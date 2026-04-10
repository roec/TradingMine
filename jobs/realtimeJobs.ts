import { fetchAndCacheRealtime } from "@/core/market-data/marketDataService";
import { getMarketSession } from "@/core/china/marketRules";

export async function pollRealtimeCandlesJob(symbols: string[]) {
  const session = getMarketSession(new Date(), "SSE");
  if (session === "LUNCH_BREAK" || session === "CLOSED") {
    return { skipped: true, reason: session };
  }
  return fetchAndCacheRealtime({ symbols, timeframe: "1m" });
}

export async function refreshLatestSignalsJob() {
  return { ok: true, message: "Deterministic signal refresh placeholder executed." };
}

export async function refreshWatchlistJob() {
  return { ok: true, message: "Watchlist refresh placeholder executed." };
}

export async function refreshScreenerJob() {
  return { ok: true, message: "Screener refresh placeholder executed." };
}

export async function refreshAISummariesJob() {
  return { ok: true, message: "AI summary refresh placeholder executed on material change trigger." };
}

export async function eodFinalizeJob() {
  return { ok: true, message: "End-of-day finalization placeholder executed." };
}
