import { StockChart } from "@/components/stock-chart";
import { Badge, Card } from "@/components/ui";
import { buildLatestRow } from "@/lib/analytics";
import { sampleCandles } from "@/lib/sampleData";

export default async function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const candles = sampleCandles[ticker.toUpperCase()] || sampleCandles.AAPL;
  const row = buildLatestRow(candles);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Stage">
          <div className="text-3xl font-bold">{row.stage}</div>
        </Card>
        <Card title="TopExitScore">
          <div className="text-3xl font-bold">{row.TopExitScore.toFixed(2)}</div>
        </Card>
        <Card title="Risk">
          <Badge value={row.riskLevel} />
        </Card>
        <Card title="Screening Status">
          <div className="text-sm">{row.TopExitScore < 0.4 ? "Passes Top Filter" : "Fails Top Filter"}</div>
        </Card>
      </div>
      <Card title={`Chart: ${ticker.toUpperCase()}`}>
        <StockChart data={candles.map((c) => ({ time: c.timestamp, ...c }))} />
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="AI Explanation">
          <p className="text-sm text-slate-300">
            Current setup indicates stage {row.stage} with a TopExitScore of {row.TopExitScore.toFixed(2)}. Focus on
            invalidation if support breaks and volume expands without price progress.
          </p>
        </Card>
        <Card title="Strategy Compatibility">
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Trend Following: {row.close_above_ma20 ? "Compatible" : "Not ideal"}</li>
            <li>Top Exit Avoidance: {row.TopExitScore < 0.45 ? "Compatible" : "Not ideal"}</li>
            <li>Mean Reversion: {row.rsi14 < 30 ? "Candidate" : "Neutral"}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
