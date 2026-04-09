import Link from "next/link";
import { Card } from "@/components/ui";
import { strategyTemplates } from "@/core/strategies/engine";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function StrategiesPage() {
  const locale = await getCurrentLocale();
  return (
    <Card title={t(locale, "strategiesTemplates")}>
      <ul className="space-y-2">
        {strategyTemplates.map((s, i) => (
          <li key={s.name} className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2">
            <span>{s.name}</span>
            <Link href={`/strategies/${i}`} className="text-accent">{t(locale, "strategiesOpen")}</Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
