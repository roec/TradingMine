import { atr, rsi, sma, rollingReturn, volumeMA } from "@/core/indicators";
import { computeTopDetection } from "@/core/signals/topDetection";
import { Candle } from "@/core/types/domain";
import { BoardType, resolveBoardRule } from "@/core/china/boardRules";
import { computeLimitSignals } from "@/core/china/limitSignals";
import { estimateChipDistribution } from "@/core/china/chipDistribution";
import { bollinger, kdj, macdState } from "@/core/china/technical";

export function inferBoardType(symbol: string): BoardType {
  if (symbol.startsWith("688")) return "STAR";
  if (symbol.startsWith("300")) return "CHINEXT";
  if (symbol.startsWith("8") || symbol.startsWith("4")) return "BSE";
  if (symbol.startsWith("6")) return "SSE_MAIN";
  return "SZSE_MAIN";
}

export function buildLatestRow(candles: Candle[], boardTypeOverride?: BoardType) {
  const closes = candles.map((c) => c.close);
  const ma5 = sma(closes, 5);
  const ma10 = sma(closes, 10);
  const ma20 = sma(closes, 20);
  const ma60 = sma(closes, 60);
  const ma120 = sma(closes, 120);
  const ma250 = sma(closes, 250);
  const ret20 = rollingReturn(closes, 20);
  const rsi14 = rsi(closes, 14);
  const vma20 = volumeMA(candles, 20);
  const atr14 = atr(candles, 14);
  const bb = bollinger(closes, 20, 2).at(-1)!;
  const kdjValue = kdj(candles).at(-1)!;
  const macd = macdState(closes);
  const top = computeTopDetection(candles);
  const last = candles.at(-1)!;

  const boardType = boardTypeOverride ?? inferBoardType(last.symbol);
  const boardRule = resolveBoardRule({ boardType, listedDays: 200 }, last.timestamp);
  const limitSignal = computeLimitSignals(candles, boardRule);

  const turnoverRate = last.volume / 100_000_000;
  const turnover5d = avg(candles.slice(-5).map((c) => c.volume)) / 100_000_000;
  const turnoverSpike = turnoverRate / Math.max(turnover5d, 1e-6);

  const chip = estimateChipDistribution(candles, turnoverRate);
  const maBullish = [ma5.at(-1), ma10.at(-1), ma20.at(-1), ma60.at(-1)].every((x, i, arr) => i === 0 || (x || 0) > (arr[i - 1] || 0));

  return {
    close: last.close,
    volume: last.volume,
    ma5: ma5.at(-1) || last.close,
    ma10: ma10.at(-1) || last.close,
    ma20: ma20.at(-1) || last.close,
    ma60: ma60.at(-1) || last.close,
    ma120: ma120.at(-1) || last.close,
    ma250: ma250.at(-1) || last.close,
    atr14: atr14.at(-1) || 0,
    bbUpper: bb.upper,
    bbMid: bb.mid,
    bbLower: bb.lower,
    k: kdjValue.k,
    d: kdjValue.d,
    j: kdjValue.j,
    macdDif: macd.dif,
    macdDea: macd.dea,
    macdHist: macd.hist,
    macdGoldenCross: macd.goldenCross,
    macdDeathCross: macd.deathCross,
    macdAboveZero: macd.aboveZero,
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
    scoreC: top.scoreC,

    boardType,
    limitUpToday: limitSignal.limitUpClose,
    limitDownToday: limitSignal.limitDownClose,
    limitBoardScore: limitSignal.limitBoardScore,
    consecutiveLimitUpCount: limitSignal.consecutiveLimitUpCount,
    failedBoardToday: limitSignal.failedBoardSeverity !== "NONE",
    failedBoardSeverity: limitSignal.failedBoardSeverity,
    reSealToday: limitSignal.reSealToday,
    oneWordBoard: limitSignal.oneWordBoard,
    turnoverRate,
    turnover5d,
    turnoverSpike,
    ma60Rising: (ma60.at(-1) || 0) > (ma60.at(-2) || 0),
    maBullish,
    chipPeakPrice: chip.chipPeakPrice,
    chipConcentrationRatio: chip.chipConcentrationRatio,
    winnerRatioProxy: chip.winnerRatioProxy,
    trappedRatioProxy: chip.trappedRatioProxy,
    chipPressureScore: chip.chipPressureScore
  };
}

const avg = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(v.length, 1);
