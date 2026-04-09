import { NextResponse } from "next/server";
import { callLLM } from "@/core/ai/llm";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const response = await callLLM(body.messages);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
