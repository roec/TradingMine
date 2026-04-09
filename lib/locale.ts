import { cookies } from "next/headers";
import { Locale, resolveLocale } from "@/lib/i18n";

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get("locale")?.value);
}
