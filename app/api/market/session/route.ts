import { NextResponse } from "next/server";
import { getMarketSession } from "@/core/china/marketRules";
import { getActiveProviderName } from "@/core/market-data/providerRegistry";

export async function GET() {
  const now = new Date();
  return NextResponse.json({
    session: getMarketSession(now, "SSE"),
    provider: getActiveProviderName(),
    ts: now.toISOString()
  });
}
