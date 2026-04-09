import { ScreenerCondition, StrategyConfig } from "@/core/types/domain";

export function evaluateConditions(row: Record<string, number | boolean | string>, conditions: ScreenerCondition[]): boolean {
  return conditions.every((c) => {
    const left = row[c.indicator];
    switch (c.op) {
      case ">":
        return Number(left) > Number(c.value);
      case ">=":
        return Number(left) >= Number(c.value);
      case "<":
        return Number(left) < Number(c.value);
      case "<=":
        return Number(left) <= Number(c.value);
      case "=":
        return left === c.value;
      case "!=":
        return left !== c.value;
      default:
        return false;
    }
  });
}

export function validateStrategy(config: StrategyConfig) {
  if (!config.name.trim()) throw new Error("Strategy name is required.");
  if (config.risk.positionSizePct <= 0 || config.risk.positionSizePct > 1) {
    throw new Error("positionSizePct must be in (0,1].");
  }
  if (config.risk.stopLossPct <= 0 || config.risk.takeProfitPct <= 0) {
    throw new Error("Risk percentages must be positive.");
  }
  return true;
}

export const strategyTemplates: StrategyConfig[] = [
  {
    name: "Trend Following",
    universe: "all_symbols",
    entry: [
      { indicator: "close_above_ma20", op: "=", value: true },
      { indicator: "close_above_ma60", op: "=", value: true }
    ],
    exit: [{ indicator: "close_below_ma20", op: "=", value: true }],
    risk: { stopLossPct: 0.08, takeProfitPct: 0.2, maxHoldingDays: 60, positionSizePct: 0.1 }
  },
  {
    name: "Momentum Rotation",
    universe: "all_symbols",
    entry: [{ indicator: "ret20", op: ">", value: 0.1 }],
    exit: [{ indicator: "ret20", op: "<", value: 0.03 }],
    risk: { stopLossPct: 0.07, takeProfitPct: 0.25, maxHoldingDays: 30, positionSizePct: 0.12 }
  },
  {
    name: "Top Exit Avoidance",
    universe: "all_symbols",
    entry: [{ indicator: "TopExitScore", op: "<", value: 0.45 }],
    exit: [{ indicator: "TopExitScore", op: ">", value: 0.65 }],
    risk: { stopLossPct: 0.08, takeProfitPct: 0.18, maxHoldingDays: 35, positionSizePct: 0.1 }
  },
  {
    name: "Breakout with Top Filter",
    universe: "all_symbols",
    entry: [
      { indicator: "close_above_ma20", op: "=", value: true },
      { indicator: "ret20", op: ">", value: 0.1 },
      { indicator: "TopExitScore", op: "<", value: 0.4 }
    ],
    exit: [
      { indicator: "TopExitScore", op: ">", value: 0.7 },
      { indicator: "close_below_ma10", op: "=", value: true }
    ],
    risk: { stopLossPct: 0.08, takeProfitPct: 0.2, maxHoldingDays: 30, positionSizePct: 0.1 }
  },
  {
    name: "Mean Reversion",
    universe: "all_symbols",
    entry: [{ indicator: "rsi14", op: "<", value: 30 }],
    exit: [{ indicator: "rsi14", op: ">", value: 55 }],
    risk: { stopLossPct: 0.06, takeProfitPct: 0.12, maxHoldingDays: 15, positionSizePct: 0.08 }
  },
  {
    name: "Volume-Price Anomaly Strategy",
    universe: "all_symbols",
    entry: [
      { indicator: "volumeSpike", op: ">", value: 1.5 },
      { indicator: "weakClose", op: "=", value: false }
    ],
    exit: [{ indicator: "TopExitScore", op: ">", value: 0.65 }],
    risk: { stopLossPct: 0.08, takeProfitPct: 0.22, maxHoldingDays: 20, positionSizePct: 0.1 }
  }
];
