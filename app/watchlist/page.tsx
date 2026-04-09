import { Badge, Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";

export default function WatchlistPage() {
  const rows = getUniverseRows();
  return (
    <Card title="Watchlist">
      {rows.map((r) => (
        <div key={r.symbol} className="mb-2 flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2 text-sm">
          <span>{r.symbol}</span>
          <div className="flex items-center gap-2">
            <span>{r.TopExitScore.toFixed(2)}</span>
            <Badge value={r.riskLevel} />
          </div>
        </div>
      ))}
    </Card>
  );
}
