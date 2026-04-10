import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "default";
  const raw = await redis.get(`screeners:result:${id}`);
  return NextResponse.json(raw ? JSON.parse(raw) : { id, results: [], freshness: "UNAVAILABLE" });
}
