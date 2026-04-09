import { Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScreenerDetailPage({ params }: PageProps) {
  const locale = await getCurrentLocale();
  const { id } = await params;
  const rows = getUniverseRows().sort((a, b) => b.ret20 - a.ret20);
  return (
    <div className="space-y-4">
      <Card title={`${t(locale, "screenersRun")}: ${id}`}>
        <p className="text-sm text-slate-300">{t(locale, "screenersRankDescription")}</p>
      </Card>
      <Card title={t(locale, "screenersResults")}>
        {rows.map((r) => (
          <div key={r.symbol} className="flex items-center justify-between border-b border-slate-800 py-2 text-sm">
            <span>{r.symbol}</span>
            <span>{t(locale, "momentum")} {(r.ret20 * 100).toFixed(2)}%</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
