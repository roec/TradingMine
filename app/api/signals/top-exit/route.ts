import { NextResponse } from "next/server";
import { getCandles } from "@/lib/market-data";
import { buildLatestRow } from "@/lib/analytics";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get("symbol") || "600519").toUpperCase();
  const row = buildLatestRow(await getCandles(symbol));
  return NextResponse.json({
    symbol,
    scoreA: row.scoreA,
    scoreB: row.scoreB,
    scoreC: row.scoreC,
    topExitScore: row.TopExitScore,
    stage: row.stage,
    risk: row.riskLevel
  });
}
