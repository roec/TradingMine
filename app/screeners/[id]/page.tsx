import { Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScreenerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const rows = getUniverseRows().sort((a, b) => b.ret20 - a.ret20);
  return (
    <div className="space-y-4">
      <Card title={`Screener Run: ${id}`}>
        <p className="text-sm text-slate-300">Ranked by momentum, liquidity and TopExitScore constraint.</p>
      </Card>
      <Card title="Results">
        {rows.map((r) => (
          <div key={r.symbol} className="flex items-center justify-between border-b border-slate-800 py-2 text-sm">
            <span>{r.symbol}</span>
            <span>Momentum {(r.ret20 * 100).toFixed(2)}%</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
