import { sma, rsi, rollingReturn, volumeMA } from "@/core/indicators";
import { computeTopDetection } from "@/core/signals/topDetection";
import { Candle } from "@/core/types/domain";

export function buildLatestRow(candles: Candle[]) {
  const closes = candles.map((c) => c.close);
  const ma10 = sma(closes, 10);
  const ma20 = sma(closes, 20);
  const ma60 = sma(closes, 60);
  const ret20 = rollingReturn(closes, 20);
  const rsi14 = rsi(closes, 14);
  const vma20 = volumeMA(candles, 20);
  const top = computeTopDetection(candles);
  const last = candles.at(-1)!;

  return {
    close: last.close,
    volume: last.volume,
    ma10: ma10.at(-1) || last.close,
    ma20: ma20.at(-1) || last.close,
    ma60: ma60.at(-1) || last.close,
    ret20: ret20.at(-1) || 0,
    rsi14: rsi14.at(-1) || 50,
    volumeSpike: last.volume / Math.max(vma20.at(-1) || 1, 1),
    close_above_ma20: last.close > (ma20.at(-1) || last.close),
    close_above_ma60: last.close > (ma60.at(-1) || last.close),
    close_below_ma20: last.close < (ma20.at(-1) || last.close),
    close_below_ma10: last.close < (ma10.at(-1) || last.close),
    weakClose: (last.high - last.close) / Math.max(last.high - last.low, 1e-6) > 0.5,
    HighPos: top.highPos,
    TopExitScore: top.topExitScore,
    stage: top.stage,
    riskLevel: top.riskLevel,
    breakdown: top.flags.breakdown,
    scoreA: top.scoreA,
    scoreB: top.scoreB,
    scoreC: top.scoreC
  };
}
