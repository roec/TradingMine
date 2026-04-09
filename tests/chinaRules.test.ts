import { describe, expect, it } from "vitest";
import { canCancelOrder, getMarketSession } from "@/core/china/marketRules";
import { resolveBoardRule } from "@/core/china/boardRules";
import { classifyEmotionPhase } from "@/core/china/emotionCycle";

describe("china market rules", () => {
  it("classifies session windows", () => {
    const s = getMarketSession(new Date("2026-04-09T09:22:00+08:00"), "SSE");
    expect(s).toBe("OPEN_AUCTION");
    expect(canCancelOrder(new Date("2026-04-09T09:22:00+08:00"), "SSE")).toBe(false);
  });

  it("resolves board limit rules", () => {
    const rule = resolveBoardRule({ boardType: "CHINEXT", listedDays: 100 }, "2026-04-09");
    expect(rule.dailyLimitPct).toBe(0.2);
  });

  it("classifies emotion phase", () => {
    const phase = classifyEmotionPhase({
      limitUpCount: 60,
      limitDownCount: 10,
      failedBoardCount: 8,
      reSealRate: 0.4,
      consecutiveBoardMax: 4,
      breadthRatio: 0.62,
      heatScore: 0.75,
      panicScore: 0.2
    });
    expect(phase).toBe("Speculative Expansion");
  });
});
