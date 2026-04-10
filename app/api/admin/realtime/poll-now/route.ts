import { NextResponse } from "next/server";
import { pollRealtimeCandlesJob } from "@/jobs/realtimeJobs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const symbols = body.symbols || ["600519.SH", "000001.SZ", "300750.SZ"];
  const result = await pollRealtimeCandlesJob(symbols);
  return NextResponse.json(result);
}
