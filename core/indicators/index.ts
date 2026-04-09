import { Candle } from "@/core/types/domain";

const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
const std = (arr: number[]) => {
  const mean = avg(arr);
  return Math.sqrt(avg(arr.map((v) => (v - mean) ** 2)));
};

export function sma(values: number[], period: number): number[] {
  return values.map((_, i) => {
    if (i + 1 < period) return Number.NaN;
    return avg(values.slice(i + 1 - period, i + 1));
  });
}

export function ema(values: number[], period: number): number[] {
  const k = 2 / (period + 1);
  return values.reduce<number[]>((acc, value, idx) => {
    if (idx === 0) return [value];
    acc.push(value * k + acc[idx - 1] * (1 - k));
    return acc;
  }, []);
}

export function rsi(values: number[], period = 14): number[] {
  const gains: number[] = [0];
  const losses: number[] = [0];
  for (let i = 1; i < values.length; i += 1) {
    const d = values[i] - values[i - 1];
    gains.push(Math.max(d, 0));
    losses.push(Math.max(-d, 0));
  }
  return values.map((_, i) => {
    if (i < period) return Number.NaN;
    const avgGain = avg(gains.slice(i + 1 - period, i + 1));
    const avgLoss = avg(losses.slice(i + 1 - period, i + 1));
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
  });
}

export function atr(candles: Candle[], period = 14): number[] {
  const tr = candles.map((c, i) => {
    if (i === 0) return c.high - c.low;
    const prevClose = candles[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  });
  return sma(tr, period);
}

export function macd(values: number[]): { macd: number[]; signal: number[]; histogram: number[] } {
  const fast = ema(values, 12);
  const slow = ema(values, 26);
  const m = values.map((_, i) => fast[i] - slow[i]);
  const signal = ema(m, 9);
  return { macd: m, signal, histogram: m.map((v, i) => v - signal[i]) };
}

export function rollingReturn(values: number[], period: number): number[] {
  return values.map((v, i) => (i < period ? Number.NaN : v / values[i - period] - 1));
}

export function rollingVolatility(values: number[], period: number): number[] {
  const rets = rollingReturn(values, 1).map((v) => (Number.isNaN(v) ? 0 : v));
  return rets.map((_, i) => (i + 1 < period ? Number.NaN : std(rets.slice(i + 1 - period, i + 1))));
}

export function volumeMA(candles: Candle[], period: number): number[] {
  return sma(candles.map((c) => c.volume), period);
}

export function supportResistance(candles: Candle[], lookback = 20) {
  return candles.map((_, i) => {
    const w = candles.slice(Math.max(0, i + 1 - lookback), i + 1);
    return {
      support: Math.min(...w.map((c) => c.low)),
      resistance: Math.max(...w.map((c) => c.high))
    };
  });
}
