import { Candle } from "@/core/types/domain";
import { BoardRule, getDailyLimitPrices } from "@/core/china/boardRules";

export type FailedBoardSeverity = "NONE" | "MILD" | "STRONG" | "HIGH_VOLUME";

export type LimitSignalResult = {
  limitUpTouched: boolean;
  limitUpClose: boolean;
  limitDownTouched: boolean;
  limitDownClose: boolean;
  reSealToday: boolean;
  failedBoardSeverity: FailedBoardSeverity;
  oneWordBoard: boolean;
  consecutiveLimitUpCount: number;
  consecutiveOneWordCount: number;
  limitBoardScore: number;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function computeLimitSignals(candles: Candle[], boardRule: BoardRule): LimitSignalResult {
  const n = candles.length;
  const last = candles[n - 1];
  const prevClose = candles[n - 2]?.close ?? last.close;
  const { up, down } = getDailyLimitPrices(prevClose, boardRule);

  const limitUpTouched = last.high >= up * 0.999;
  const limitUpClose = last.close >= up * 0.999;
  const limitDownTouched = last.low <= down * 1.001;
  const limitDownClose = last.close <= down * 1.001;

  const oneWordBoard = limitUpClose && Math.abs(last.open - last.close) / Math.max(last.close, 1e-6) < 0.001 && Math.abs(last.high - last.low) / Math.max(last.close, 1e-6) < 0.0015;
  const reSealToday = limitUpTouched && limitUpClose && last.close < last.high * 1.0005;

  let consecutiveLimitUpCount = 0;
  let consecutiveOneWordCount = 0;
  for (let i = n - 1; i >= 1; i -= 1) {
    const p = candles[i - 1].close;
    const d = getDailyLimitPrices(p, boardRule);
    const isUp = candles[i].close >= d.up * 0.999;
    if (!isUp) break;
    consecutiveLimitUpCount += 1;
    const isOneWord = Math.abs(candles[i].open - candles[i].close) / Math.max(candles[i].close, 1e-6) < 0.001;
    if (isOneWord) consecutiveOneWordCount += 1;
  }

  const failRatio = limitUpTouched && !limitUpClose ? (last.high - last.close) / Math.max(last.high - last.low, 1e-6) : 0;
  const volSpike = (last.volume - avg(candles.slice(-5).map((c) => c.volume))) / Math.max(avg(candles.slice(-20).map((c) => c.volume)), 1);
  const failedBoardSeverity: FailedBoardSeverity = !limitUpTouched || limitUpClose
    ? "NONE"
    : volSpike > 0.7 && failRatio > 0.6
    ? "HIGH_VOLUME"
    : failRatio > 0.5
    ? "STRONG"
    : "MILD";

  const sealStrength = clamp01(limitUpClose ? 1 - (last.high - last.close) / Math.max(last.high, 1e-6) : 0);
  const consecutiveScore = clamp01(consecutiveLimitUpCount / 5);
  const reSealStrength = reSealToday ? 1 : 0;
  const volumeSupport = clamp01((last.volume / Math.max(avg(candles.slice(-20).map((c) => c.volume)), 1) - 1) / 2 + 0.5);
  const auctionStrength = clamp01((last.close - last.open) / Math.max(last.open * 0.04, 1e-6) + 0.5);

  const limitBoardScore =
    0.25 * sealStrength +
    0.2 * consecutiveScore +
    0.2 * reSealStrength +
    0.2 * volumeSupport +
    0.15 * auctionStrength;

  return {
    limitUpTouched,
    limitUpClose,
    limitDownTouched,
    limitDownClose,
    reSealToday,
    failedBoardSeverity,
    oneWordBoard,
    consecutiveLimitUpCount,
    consecutiveOneWordCount,
    limitBoardScore
  };
}

const avg = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(v.length, 1);
