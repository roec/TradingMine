import { NextResponse } from "next/server";
import { resolveLocale } from "@/lib/i18n";

export async function POST(req: Request) {
  const body = await req.json();
  const locale = resolveLocale(body?.locale);
  const response = NextResponse.json({ ok: true, locale });
  response.cookies.set("locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  return response;
}
