import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ ok: true, symbol: body.symbol, message: "AI refresh flagged for material-change workflow." });
}
