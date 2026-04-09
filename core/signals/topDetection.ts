import { Candle, TopDetectionResult } from "@/core/types/domain";
import { ema, sma, supportResistance, volumeMA } from "@/core/indicators";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function computeTopDetection(candles: Candle[]): TopDetectionResult {
  const last = candles[candles.length - 1];
  const closes = candles.map((c) => c.close);
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const vols = candles.map((c) => c.volume);
  const lookback = candles.slice(-20);

  const rollingMin = Math.min(...lookback.map((c) => c.low));
  const rollingMax = Math.max(...lookback.map((c) => c.high));
  const highPos = clamp01((last.close - rollingMin) / Math.max(rollingMax - rollingMin, 1e-9));

  const ema10 = ema(closes, 10);
  const ema20 = ema(closes, 20);
  const momentumDecay = clamp01((ema20.at(-1)! - ema10.at(-1)!) / Math.max(last.close, 1e-9) + 0.5);

  const upperShadow = clamp01((last.high - Math.max(last.open, last.close)) / Math.max(last.high - last.low, 1e-9));

  const volma20 = volumeMA(candles, 20).at(-1) || 1;
  const weakClose = clamp01((last.high - last.close) / Math.max(last.high - last.low, 1e-9));
  const volumeDistribution = clamp01((last.volume / volma20 - 1) * weakClose);

  const platformRange = Math.max(...highs.slice(-15)) - Math.min(...lows.slice(-15));
  const platformTightness = clamp01(1 - platformRange / Math.max(last.close * 0.12, 1e-9));

  const zipperEffectRaw = lookback.slice(-10).reduce((acc, c, idx, arr) => {
    if (idx === 0) return acc;
    const prev = arr[idx - 1];
    const changed = (c.close - c.open) * (prev.close - prev.open) < 0;
    return acc + (changed ? 1 : 0);
  }, 0);
  const zipperEffect = clamp01(zipperEffectRaw / 9);

  const centerNow = avg(lookback.slice(-5).map((c) => (c.open + c.close) / 2));
  const centerPrev = avg(lookback.slice(-10, -5).map((c) => (c.open + c.close) / 2));
  const centerDrift = clamp01((centerPrev - centerNow) / Math.max(centerPrev * 0.03, 1e-9));

  const volumeNoAdvance = clamp01((avg(vols.slice(-5)) / Math.max(volma20, 1e-9)) * (1 - highPos));

  const sr = supportResistance(candles, 20).at(-1)!;
  const breakdown = last.close < sr.support ? 1 : clamp01((sr.support - last.close) / Math.max(last.close * 0.03, 1e-9));
  const longBearBar = clamp01((last.open - last.close) / Math.max(last.open * 0.04, 1e-9));
  const ma10 = sma(closes, 10).at(-1) || last.close;
  const ma20s = sma(closes, 20).at(-1) || last.close;
  const maFailure = clamp01((Math.max(ma10, ma20s) - last.close) / Math.max(last.close * 0.03, 1e-9));

  const recentHigh = Math.max(...highs.slice(-10));
  const retestFailure = clamp01((recentHigh - last.close) / Math.max(recentHigh * 0.05, 1e-9));

  const scoreA = 0.3 * highPos + 0.25 * momentumDecay + 0.2 * upperShadow + 0.25 * volumeDistribution;
  const scoreB =
    0.25 * highPos + 0.25 * platformTightness + 0.2 * zipperEffect + 0.15 * centerDrift + 0.15 * volumeNoAdvance;
  const scoreC = 0.3 * breakdown + 0.25 * longBearBar + 0.2 * maFailure + 0.25 * retestFailure;
  const topExitScore = 0.35 * scoreA + 0.35 * scoreB + 0.3 * scoreC;

  const stage =
    scoreA >= scoreB && scoreA >= scoreC ? "A" : scoreB >= scoreA && scoreB >= scoreC ? "B" : "C";
  const riskLevel =
    topExitScore < 0.35 ? "Normal" : topExitScore < 0.55 ? "Warning" : topExitScore < 0.75 ? "Reduce" : "Exit";

  return {
    stage,
    scoreA,
    scoreB,
    scoreC,
    highPos,
    topExitScore,
    riskLevel,
    flags: {
      breakdown: breakdown > 0.6,
      weakClose: weakClose > 0.5,
      maFailure: maFailure > 0.6
    }
  };
}

function avg(v: number[]) {
  return v.reduce((a, b) => a + b, 0) / (v.length || 1);
}
