import { describe, expect, it } from "vitest";
import { computeTopDetection } from "@/core/signals/topDetection";
import { generateCandles } from "@/lib/sampleData";

describe("top detection", () => {
  it("returns deterministic stage and score", () => {
    const candles = generateCandles("AAPL", 120);
    const a = computeTopDetection(candles);
    const b = computeTopDetection(candles);
    expect(a.stage).toBe(b.stage);
    expect(a.topExitScore).toBeCloseTo(b.topExitScore);
  });
});
