import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/service";

export async function GET() {
  return NextResponse.json(await getDashboardData());
}
