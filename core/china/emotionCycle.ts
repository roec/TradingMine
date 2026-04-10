export type EmotionPhase =
  | "Risk-Off"
  | "Weak Rebound"
  | "Rotation"
  | "Speculative Expansion"
  | "Climax"
  | "Distribution"
  | "Breakdown";

export type EmotionMetrics = {
  limitUpCount: number;
  limitDownCount: number;
  failedBoardCount: number;
  reSealRate: number;
  consecutiveBoardMax: number;
  breadthRatio: number;
  heatScore: number;
  panicScore: number;
};

export function classifyEmotionPhase(m: EmotionMetrics): EmotionPhase {
  if (m.panicScore > 0.7 || (m.limitDownCount > m.limitUpCount * 1.5 && m.breadthRatio < 0.4)) return "Breakdown";
  if (m.heatScore > 0.85 && m.failedBoardCount > m.limitUpCount * 0.35) return "Distribution";
  if (m.heatScore > 0.85 && m.failedBoardCount <= m.limitUpCount * 0.2) return "Climax";
  if (m.heatScore > 0.65 && m.consecutiveBoardMax >= 3) return "Speculative Expansion";
  if (m.breadthRatio > 0.5 && m.limitUpCount > m.limitDownCount) return "Rotation";
  if (m.breadthRatio > 0.45) return "Weak Rebound";
  return "Risk-Off";
}
