import { Badge, Card } from "@/components/ui";
import { getDashboardData } from "@/lib/service";

export default function DashboardPage() {
  const data = getDashboardData();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Market Overview">
        <div className="space-y-2">
          {data.marketOverview.map((r) => (
            <div key={r.symbol} className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2">
              <span>{r.symbol}</span>
              <span>{(r.ret20 * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Top Risk Signals">
        <div className="space-y-2">
          {data.topRiskSignals.map((r) => (
            <div key={r.symbol} className="flex items-center justify-between">
              <span>{r.symbol}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs">{Number(r.TopExitScore).toFixed(2)}</span>
                <Badge value={r.riskLevel} />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Strategy Snapshot">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Total Return: {(data.strategySnapshot.totalReturn * 100).toFixed(2)}%</li>
          <li>CAGR: {(data.strategySnapshot.cagr * 100).toFixed(2)}%</li>
          <li>Sharpe: {data.strategySnapshot.sharpe.toFixed(2)}</li>
          <li>Max Drawdown: {(data.strategySnapshot.maxDrawdown * 100).toFixed(2)}%</li>
        </ul>
      </Card>
      <Card title="Screened Opportunities">
        <div className="space-y-2">
          {data.screened.map((r) => (
            <div key={r.symbol} className="flex justify-between text-sm">
              <span>{r.symbol}</span>
              <span>{Number(r.TopExitScore).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Recent AI Insights">
        <ul className="list-disc space-y-2 pl-4 text-sm text-slate-300">
          {data.recentInsights.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Card>
      <Card title="Watchlist Summary">
        <p className="text-sm text-slate-300">3 symbols tracked. 1 Warning, 0 Exit, 2 Normal.</p>
      </Card>
    </div>
  );
}
