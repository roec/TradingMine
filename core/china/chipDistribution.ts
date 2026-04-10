import { Candle } from "@/core/types/domain";

export type ChipDistribution = {
  chipPeakPrice: number;
  chipConcentrationRatio: number;
  winnerRatioProxy: number;
  trappedRatioProxy: number;
  chipPressureScore: number;
  supportFromChips: number;
  resistanceFromChips: number;
};

export function estimateChipDistribution(candles: Candle[], turnoverRate: number): ChipDistribution {
  const window = candles.slice(-60);
  const bins = new Map<number, number>();
  for (const c of window) {
    const typical = (c.open + c.high + c.low + c.close) / 4;
    const key = Math.round(typical * 10) / 10;
    bins.set(key, (bins.get(key) || 0) + c.volume);
  }
  const sorted = [...bins.entries()].sort((a, b) => b[1] - a[1]);
  const totalVol = sorted.reduce((s, [, v]) => s + v, 0) || 1;
  const peak = sorted[0]?.[0] ?? candles.at(-1)!.close;
  const concentration = (sorted.slice(0, 5).reduce((s, [, v]) => s + v, 0) || 0) / totalVol;

  const close = candles.at(-1)!.close;
  const winnerRatioProxy = Math.max(0, Math.min(1, close / peak - 0.5));
  const trappedRatioProxy = Math.max(0, Math.min(1, (peak - close) / peak + (1 - winnerRatioProxy)));
  const chipPressureScore = Math.max(0, Math.min(1, trappedRatioProxy * 0.6 + concentration * 0.4 + turnoverRate * 0.2));

  return {
    chipPeakPrice: peak,
    chipConcentrationRatio: concentration,
    winnerRatioProxy,
    trappedRatioProxy,
    chipPressureScore,
    supportFromChips: peak * 0.98,
    resistanceFromChips: peak * 1.02
  };
}
