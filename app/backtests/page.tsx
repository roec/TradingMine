import Link from "next/link";
import { Card } from "@/components/ui";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function BacktestsPage() {
  const locale = await getCurrentLocale();
  return (
    <Card title={t(locale, "backtestsRuns")}>
      <div className="flex items-center justify-between rounded-lg bg-slate-900/40 p-3">
        <div>
          <div className="font-medium">{t(locale, "backtestsDemoTitle")}</div>
          <div className="text-xs text-slate-400">{t(locale, "backtestsDemoDesc")}</div>
        </div>
        <Link href="/backtests/demo" className="text-accent">{t(locale, "backtestsInspect")}</Link>
      </div>
    </Card>
  );
}
