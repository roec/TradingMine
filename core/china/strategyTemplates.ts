import { StrategyConfig } from "@/core/types/domain";

export const chinaStrategyTemplates: StrategyConfig[] = [
  {
    name: "MA60 Trend Following (CN)",
    universe: "cn_a_share",
    entry: [
      { indicator: "close_above_ma60", op: "=", value: true },
      { indicator: "ma60Rising", op: "=", value: true },
      { indicator: "macdAboveZero", op: "=", value: true },
      { indicator: "TopExitScore", op: "<", value: 0.4 }
    ],
    exit: [
      { indicator: "close_below_ma20", op: "=", value: true },
      { indicator: "macdDeathCross", op: "=", value: true },
      { indicator: "TopExitScore", op: ">", value: 0.7 }
    ],
    risk: { stopLossPct: 0.08, takeProfitPct: 0.22, maxHoldingDays: 30, positionSizePct: 0.1 }
  },
  {
    name: "Breakout with Emotion Filter (CN)",
    universe: "cn_a_share",
    entry: [
      { indicator: "ret20", op: ">", value: 0.1 },
      { indicator: "turnoverSpike", op: ">", value: 1.3 },
      { indicator: "TopExitScore", op: "<", value: 0.5 }
    ],
    exit: [
      { indicator: "close_below_ma10", op: "=", value: true },
      { indicator: "TopExitScore", op: ">", value: 0.65 }
    ],
    risk: { stopLossPct: 0.07, takeProfitPct: 0.2, maxHoldingDays: 20, positionSizePct: 0.1 }
  },
  {
    name: "Limit-Up Re-Seal Strategy (CN)",
    universe: "cn_a_share",
    entry: [
      { indicator: "reSealToday", op: "=", value: true },
      { indicator: "turnoverSpike", op: ">", value: 1.2 }
    ],
    exit: [
      { indicator: "failedBoardToday", op: "=", value: true },
      { indicator: "close_below_ma10", op: "=", value: true }
    ],
    risk: { stopLossPct: 0.09, takeProfitPct: 0.18, maxHoldingDays: 10, positionSizePct: 0.08 }
  },
  {
    name: "Failed Board Short-Warning Model (CN)",
    universe: "cn_a_share",
    entry: [{ indicator: "failedBoardToday", op: "=", value: true }],
    exit: [{ indicator: "turnoverSpike", op: "<", value: 1.0 }],
    risk: { stopLossPct: 0.06, takeProfitPct: 0.1, maxHoldingDays: 5, positionSizePct: 0.05 }
  },
  {
    name: "Top Exit Avoidance Strategy (CN)",
    universe: "cn_a_share",
    entry: [{ indicator: "TopExitScore", op: "<", value: 0.45 }],
    exit: [
      { indicator: "TopExitScore", op: ">", value: 0.65 },
      { indicator: "chipPressureScore", op: ">", value: 0.7 },
      { indicator: "failedBoardToday", op: "=", value: true }
    ],
    risk: { stopLossPct: 0.08, takeProfitPct: 0.2, maxHoldingDays: 25, positionSizePct: 0.1 }
  }
];
