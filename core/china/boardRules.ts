import { Candle } from "@/core/types/domain";

export type BoardType = "SSE_MAIN" | "SZSE_MAIN" | "CHINEXT" | "STAR" | "BSE";

export type BoardRule = {
  board: BoardType;
  dailyLimitPct: number | null;
  noLimitFirstNDays?: number;
  tPlusOne: boolean;
  lotSize: number;
};

const BOARD_RULES: Record<BoardType, BoardRule> = {
  SSE_MAIN: { board: "SSE_MAIN", dailyLimitPct: 0.1, tPlusOne: true, lotSize: 100 },
  SZSE_MAIN: { board: "SZSE_MAIN", dailyLimitPct: 0.1, tPlusOne: true, lotSize: 100 },
  CHINEXT: { board: "CHINEXT", dailyLimitPct: 0.2, tPlusOne: true, lotSize: 100 },
  STAR: { board: "STAR", dailyLimitPct: 0.2, noLimitFirstNDays: 5, tPlusOne: true, lotSize: 100 },
  BSE: { board: "BSE", dailyLimitPct: 0.3, noLimitFirstNDays: 1, tPlusOne: true, lotSize: 100 }
};

export function resolveBoardRule(symbol: { boardType: BoardType; listedDays?: number }, _tradeDate: string): BoardRule {
  const rule = BOARD_RULES[symbol.boardType];
  if (rule.noLimitFirstNDays && (symbol.listedDays ?? 999) <= rule.noLimitFirstNDays) {
    return { ...rule, dailyLimitPct: null };
  }
  return rule;
}

export function getDailyLimitPrices(prevClose: number, boardRule: BoardRule) {
  if (boardRule.dailyLimitPct === null) return { up: Number.POSITIVE_INFINITY, down: 0 };
  return {
    up: prevClose * (1 + boardRule.dailyLimitPct),
    down: prevClose * (1 - boardRule.dailyLimitPct)
  };
}

export function isLimitUp(candle: Candle, prevClose: number, boardRule: BoardRule) {
  const { up } = getDailyLimitPrices(prevClose, boardRule);
  return candle.close >= up * 0.999;
}

export function isLimitDown(candle: Candle, prevClose: number, boardRule: BoardRule) {
  const { down } = getDailyLimitPrices(prevClose, boardRule);
  return candle.close <= down * 1.001;
}
