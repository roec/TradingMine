import { NextResponse } from "next/server";
import { getUniverseRows } from "@/lib/service";

export async function GET() {
  return NextResponse.json({ items: getUniverseRows().slice(0, 3) });
}
