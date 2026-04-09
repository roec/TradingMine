import { ScreenerCondition } from "@/core/types/domain";

export type ChinaScreenerTemplate = {
  name: string;
  conditions: ScreenerCondition[];
};

export const chinaScreeners: ChinaScreenerTemplate[] = [
  { name: "Strong Trend Above MA60", conditions: [{ indicator: "close_above_ma60", op: "=", value: true }, { indicator: "ma60Rising", op: "=", value: true }] },
  { name: "Low-Risk Breakout Candidate", conditions: [{ indicator: "ret20", op: ">", value: 0.08 }, { indicator: "TopExitScore", op: "<", value: 0.45 }] },
  { name: "First Board Candidate", conditions: [{ indicator: "limitUpToday", op: "=", value: true }, { indicator: "consecutiveLimitUpCount", op: "=", value: 1 }] },
  { name: "Consecutive Limit-Up Continuation", conditions: [{ indicator: "consecutiveLimitUpCount", op: ">=", value: 2 }] },
  { name: "Re-Seal Strong Stock", conditions: [{ indicator: "reSealToday", op: "=", value: true }] },
  { name: "Failed Board Risk List", conditions: [{ indicator: "failedBoardToday", op: "=", value: true }] },
  { name: "High Turnover Speculation List", conditions: [{ indicator: "turnoverSpike", op: ">", value: 1.5 }] },
  { name: "Top Distribution Warning List", conditions: [{ indicator: "TopExitScore", op: ">", value: 0.65 }] },
  { name: "MA60 Breakdown Risk List", conditions: [{ indicator: "close_above_ma60", op: "=", value: false }] },
  { name: "High Chip Pressure List", conditions: [{ indicator: "chipPressureScore", op: ">", value: 0.65 }] }
];
