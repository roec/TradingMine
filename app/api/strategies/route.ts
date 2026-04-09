import { NextResponse } from "next/server";
import { strategyTemplates } from "@/core/strategies/engine";

export async function GET() {
  return NextResponse.json({ strategies: strategyTemplates });
}
