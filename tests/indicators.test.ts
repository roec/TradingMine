import { describe, expect, it } from "vitest";
import { ema, sma, rsi } from "@/core/indicators";

describe("indicators", () => {
  it("computes sma", () => {
    const out = sma([1, 2, 3, 4, 5], 3);
    expect(out[2]).toBe(2);
    expect(out[4]).toBe(4);
  });

  it("computes ema", () => {
    const out = ema([1, 2, 3], 2);
    expect(out.length).toBe(3);
    expect(out[2]).toBeGreaterThan(out[1]);
  });

  it("computes rsi", () => {
    const out = rsi([1, 2, 3, 2, 3, 4, 5, 4, 5, 6, 7, 8, 7, 8, 9], 14);
    expect(Number.isNaN(out[0])).toBe(true);
    expect(out.at(-1)).toBeGreaterThan(0);
  });
});
