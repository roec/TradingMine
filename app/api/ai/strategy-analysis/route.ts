import { NextResponse } from "next/server";
import { callLLM } from "@/core/ai/llm";
import { strategyExplanationPrompt } from "@/core/ai/prompts";

export async function POST(req: Request) {
  const body = await req.json();
  const response = await callLLM([{ role: "user", content: strategyExplanationPrompt(body.payload) }]);
  return NextResponse.json(response);
}
