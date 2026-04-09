import { describe, expect, it } from "vitest";
import { runScreener } from "@/core/screening/engine";

describe("screener", () => {
  it("filters with composable conditions", () => {
    const rows = [
      { symbol: "AAA", TopExitScore: 0.3, close_above_ma20: true },
      { symbol: "BBB", TopExitScore: 0.6, close_above_ma20: true }
    ];
    const out = runScreener(rows, [
      { indicator: "TopExitScore", op: "<", value: 0.4 },
      { indicator: "close_above_ma20", op: "=", value: true }
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].symbol).toBe("AAA");
  });
});
