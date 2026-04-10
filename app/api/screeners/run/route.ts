import { NextResponse } from "next/server";
import { getUniverseRows } from "@/lib/service";
import { runScreener } from "@/core/screening/engine";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const body = await req.json();
  const rows = await getUniverseRows();
  const results = runScreener(rows, body.conditions || []);
  const screenerId = body.id || "default";
  await redis.set(`screeners:result:${screenerId}`, JSON.stringify({ ts: new Date().toISOString(), results }), { EX: 300 });
  return NextResponse.json({ screenerId, results });
}
