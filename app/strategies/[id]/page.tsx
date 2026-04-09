import { Card } from "@/components/ui";
import { strategyTemplates } from "@/core/strategies/engine";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StrategyDetailPage({ params }: PageProps) {
  const locale = await getCurrentLocale();
  const { id } = await params;
  const strategy = strategyTemplates[Number(id)] || strategyTemplates[0];
  return (
    <div className="space-y-4">
      <Card title={strategy.name}>
        <pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-xs">{JSON.stringify(strategy, null, 2)}</pre>
      </Card>
      <Card title={t(locale, "strategiesAiInterpretation")}>
        <p className="text-sm text-slate-300">{t(locale, "strategiesAiText")}</p>
      </Card>
    </div>
  );
}
