"use client";

import { useRouter } from "next/navigation";
import { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale, label, enLabel, zhLabel }: { locale: Locale; label: string; enLabel: string; zhLabel: string }) {
  const router = useRouter();

  async function onChange(nextLocale: Locale) {
    await fetch("/api/settings/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale })
    });
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-xs text-slate-300">
      <span>{label}</span>
      <select
        className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1"
        value={locale}
        onChange={(e) => onChange(e.target.value as Locale)}
      >
        <option value="en">{enLabel}</option>
        <option value="zh">{zhLabel}</option>
      </select>
    </label>
  );
}
