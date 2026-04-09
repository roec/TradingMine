import { Card } from "@/components/ui";
import { getDashboardData } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BacktestDetailPage({ params }: PageProps) {
  const locale = await getCurrentLocale();
  const { id } = await params;
  const metrics = getDashboardData().strategySnapshot;
  return (
    <div className="space-y-4">
      <Card title={`Backtest ${id}`}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>{t(locale, "totalReturn")}: {(metrics.totalReturn * 100).toFixed(2)}%</div>
          <div>{t(locale, "cagr")}: {(metrics.cagr * 100).toFixed(2)}%</div>
          <div>{t(locale, "sharpe")}: {metrics.sharpe.toFixed(2)}</div>
          <div>{t(locale, "sortino")}: {metrics.sortino.toFixed(2)}</div>
          <div>{t(locale, "winRate")}: {(metrics.winRate * 100).toFixed(1)}%</div>
          <div>{t(locale, "profitFactor")}: {metrics.profitFactor.toFixed(2)}</div>
        </div>
      </Card>
      <Card title={t(locale, "backtestsAiExplanation")}>
        <p className="text-sm text-slate-300">{t(locale, "backtestsAiText")}</p>
      </Card>
    </div>
  );
}
