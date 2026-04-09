import { Candle } from "@/core/types/domain";
import { ema, sma } from "@/core/indicators";

export function bollinger(values: number[], period = 20, k = 2) {
  const mid = sma(values, period);
  return values.map((_, i) => {
    if (i + 1 < period) return { mid: Number.NaN, upper: Number.NaN, lower: Number.NaN };
    const w = values.slice(i + 1 - period, i + 1);
    const m = mid[i];
    const sd = Math.sqrt(w.reduce((s, x) => s + (x - m) ** 2, 0) / period);
    return { mid: m, upper: m + k * sd, lower: m - k * sd };
  });
}

export function kdj(candles: Candle[], period = 9) {
  let k = 50;
  let d = 50;
  return candles.map((c, i) => {
    const start = Math.max(0, i + 1 - period);
    const w = candles.slice(start, i + 1);
    const hh = Math.max(...w.map((x) => x.high));
    const ll = Math.min(...w.map((x) => x.low));
    const rsv = hh === ll ? 50 : ((c.close - ll) / (hh - ll)) * 100;
    k = (2 / 3) * k + (1 / 3) * rsv;
    d = (2 / 3) * d + (1 / 3) * k;
    const j = 3 * k - 2 * d;
    return { k, d, j };
  });
}

export function macdState(closes: number[]) {
  const dif = ema(closes, 12).map((v, i) => v - ema(closes, 26)[i]);
  const dea = ema(dif, 9);
  const hist = dif.map((v, i) => v - dea[i]);
  const i = closes.length - 1;
  return {
    dif: dif[i],
    dea: dea[i],
    hist: hist[i],
    goldenCross: dif[i] > dea[i] && dif[i - 1] <= dea[i - 1],
    deathCross: dif[i] < dea[i] && dif[i - 1] >= dea[i - 1],
    aboveZero: dif[i] > 0 && dea[i] > 0,
    histExpanding: Math.abs(hist[i]) > Math.abs(hist[i - 1] ?? 0)
  };
}
