import { NextResponse } from "next/server";
import { callLLM } from "@/core/ai/llm";
import { stockAnalysisPrompt } from "@/core/ai/prompts";

export async function POST(req: Request) {
  const body = await req.json();
  const prompt = stockAnalysisPrompt(body.payload);
  const response = await callLLM([{ role: "user", content: prompt }]);
  return NextResponse.json(response);
}
