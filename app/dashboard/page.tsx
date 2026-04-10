import { Badge, Card } from "@/components/ui";
import { getDashboardData } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getMarketSession } from "@/core/china/marketRules";
import { getActiveProviderName } from "@/core/market-data/providerRegistry";

export default async function DashboardPage() {
  const locale = await getCurrentLocale();
  const data = await getDashboardData();
  const now = new Date();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Realtime Market Status">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Session: {getMarketSession(now, "SSE")}</li>
          <li>Provider: {getActiveProviderName()}</li>
          <li>Latest Refresh: {now.toISOString()}</li>
          <li>Screener Refresh Status: LIVE</li>
        </ul>
      </Card>
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
      <Card title={t(locale, "aShareEmotionOverview")}>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>{t(locale, "marketEmotionPhase")}: {data.emotionPhase}</li>
          <li>{t(locale, "todayLimitUpCount")}: {data.emotionMetrics.limitUpCount}</li>
          <li>{t(locale, "todayFailedBoardCount")}: {data.emotionMetrics.failedBoardCount}</li>
          <li>{t(locale, "strongestConsecutiveBoards")}: {data.emotionMetrics.consecutiveBoardMax}</li>
        </ul>
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
      <Card title={t(locale, "speculationHeatLeaderboard")}>
        <div className="space-y-2">
          {data.speculationHeatLeaderboard.map((r) => (
            <div key={r.symbol} className="flex justify-between text-sm">
              <span>{r.symbol}</span>
              <span>{t(locale, "heat")} {r.turnoverSpike.toFixed(2)}</span>
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
    </div>
  );
}
