import { describe, expect, it, vi } from "vitest";
import { callLLM } from "@/core/ai/llm";

describe("llm adapter", () => {
  it("throws on non-200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401
      })
    );
    await expect(callLLM([{ role: "user", content: "hello" }])).rejects.toThrow("LLM request failed: 401");
  });
});
