export type MarketSession =
  | "PRE_OPEN"
  | "OPEN_AUCTION"
  | "MORNING_CONTINUOUS"
  | "LUNCH_BREAK"
  | "AFTERNOON_CONTINUOUS"
  | "CLOSE_AUCTION"
  | "CLOSED";

export type ChinaExchange = "SSE" | "SZSE" | "BSE";

function toMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function getMarketSession(now: Date, _exchange: ChinaExchange): MarketSession {
  const m = toMinutes(now);
  if (m < 9 * 60 + 15) return "PRE_OPEN";
  if (m < 9 * 60 + 25) return "OPEN_AUCTION";
  if (m < 11 * 60 + 30 && m >= 9 * 60 + 30) return "MORNING_CONTINUOUS";
  if (m < 13 * 60) return "LUNCH_BREAK";
  if (m < 14 * 60 + 57) return "AFTERNOON_CONTINUOUS";
  if (m < 15 * 60) return "CLOSE_AUCTION";
  return "CLOSED";
}

export function canCancelOrder(now: Date, exchange: ChinaExchange) {
  const m = toMinutes(now);
  const blocked =
    (m >= 9 * 60 + 20 && m < 9 * 60 + 25) ||
    (m >= 14 * 60 + 57 && m < 15 * 60);
  return !blocked && getMarketSession(now, exchange) !== "CLOSED";
}

export function isAuctionWindow(now: Date, exchange: ChinaExchange) {
  const s = getMarketSession(now, exchange);
  return s === "OPEN_AUCTION" || s === "CLOSE_AUCTION";
}

export function isContinuousTrading(now: Date, exchange: ChinaExchange) {
  const s = getMarketSession(now, exchange);
  return s === "MORNING_CONTINUOUS" || s === "AFTERNOON_CONTINUOUS";
}
