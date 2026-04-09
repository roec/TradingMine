import { describe, expect, it } from "vitest";
import { evaluateConditions, validateStrategy } from "@/core/strategies/engine";

describe("strategy engine", () => {
  it("evaluates conditions", () => {
    const ok = evaluateConditions({ ret20: 0.2 }, [{ indicator: "ret20", op: ">", value: 0.1 }]);
    expect(ok).toBe(true);
  });

  it("validates strategy", () => {
    expect(() =>
      validateStrategy({
        name: "x",
        universe: "all",
        entry: [],
        exit: [],
        risk: { stopLossPct: 0.1, takeProfitPct: 0.2, maxHoldingDays: 20, positionSizePct: 0.1 }
      })
    ).not.toThrow();
  });
});
