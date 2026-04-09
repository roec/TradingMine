import { Card } from "@/components/ui";
import { getDashboardData } from "@/lib/service";

export default async function BacktestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const metrics = getDashboardData().strategySnapshot;
  return (
    <div className="space-y-4">
      <Card title={`Backtest ${id}`}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>Total Return: {(metrics.totalReturn * 100).toFixed(2)}%</div>
          <div>CAGR: {(metrics.cagr * 100).toFixed(2)}%</div>
          <div>Sharpe: {metrics.sharpe.toFixed(2)}</div>
          <div>Sortino: {metrics.sortino.toFixed(2)}</div>
          <div>Win Rate: {(metrics.winRate * 100).toFixed(1)}%</div>
          <div>Profit Factor: {metrics.profitFactor.toFixed(2)}</div>
        </div>
      </Card>
      <Card title="AI Explanation">
        <p className="text-sm text-slate-300">Performance is driven by trend persistence, with drawdown spikes during chop regimes.</p>
      </Card>
    </div>
  );
}
