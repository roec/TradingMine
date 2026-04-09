import { Badge, Card } from "@/components/ui";
import { getDashboardData } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function DashboardPage() {
  const locale = await getCurrentLocale();
  const data = await getDashboardData();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title={t(locale, "dashboardMarketOverview")}>
        <div className="space-y-2">
          {data.marketOverview.map((r) => (
            <div key={r.symbol} className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2">
              <span>{r.symbol}</span>
              <span>{(r.ret20 * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title={t(locale, "dashboardTopRiskSignals")}>
        <div className="space-y-2">
          {data.topRiskSignals.map((r) => (
            <div key={r.symbol} className="flex items-center justify-between">
              <span>{r.symbol}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">{r.TopExitScore.toFixed(2)}</span>
                <Badge value={r.riskLevel} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title={t(locale, "dashboardStrategySnapshot")}>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>{t(locale, "totalReturn")}: {(data.strategySnapshot.totalReturn * 100).toFixed(2)}%</li>
          <li>{t(locale, "cagr")}: {(data.strategySnapshot.cagr * 100).toFixed(2)}%</li>
          <li>{t(locale, "sharpe")}: {data.strategySnapshot.sharpe.toFixed(2)}</li>
          <li>{t(locale, "maxDrawdown")}: {(data.strategySnapshot.maxDrawdown * 100).toFixed(2)}%</li>
        </ul>
      </Card>
      <Card title={t(locale, "dashboardScreenedOpportunities")}>
        <div className="space-y-2">
          {data.screened.map((r) => (
            <div key={r.symbol} className="flex justify-between text-sm">
              <span>{r.symbol}</span>
              <span>{Number(r.TopExitScore).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title={t(locale, "dashboardRecentAiInsights")}>
        <ul className="list-disc space-y-2 pl-4 text-sm text-slate-300">
          {data.recentInsights.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Card>
      <Card title={t(locale, "dashboardWatchlistSummary")}>
        <p className="text-sm text-slate-300">{t(locale, "dashboardWatchlistText")}</p>
      </Card>
    </div>
  );
}
