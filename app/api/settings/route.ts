import { NextResponse } from "next/server";
import { llmConfig } from "@/core/ai/llm";

export async function GET() {
  return NextResponse.json({
    provider: llmConfig.provider,
    openaiBaseUrl: llmConfig.openai.baseUrl,
    deepseekBaseUrl: llmConfig.deepseek.baseUrl,
    backtestDefaults: { feeBps: 5, slippageBps: 3, initialCapital: 100000 }
  });
}
