import { Badge, Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function WatchlistPage() {
  const locale = await getCurrentLocale();
  const rows = await getUniverseRows();
  return (
    <Card title={t(locale, "watchlistTitle")}>
      <div className="mb-2 grid grid-cols-8 text-xs text-slate-400">
        <span>Symbol</span><span>Stage</span><span>TopExit</span><span>Turnover</span><span>MACD</span><span>KDJ</span><span>Risk</span><span>Updated</span>
      </div>
      {rows.map((r) => (
        <div key={r.symbol} className="mb-2 grid grid-cols-8 items-center rounded-lg bg-slate-900/40 px-3 py-2 text-xs">
          <span>{r.symbol}</span>
          <span>{String(r.stage)}</span>
          <span>{r.TopExitScore.toFixed(2)}</span>
          <span>{(r.turnoverRate * 100).toFixed(2)}%</span>
          <span>{r.macdGoldenCross ? "Golden" : r.macdDeathCross ? "Death" : "Neutral"}</span>
          <span>{r.k > r.d ? "Golden" : "Neutral"}</span>
          <span><Badge value={r.riskLevel} /></span>
          <span>{new Date().toISOString().slice(11, 19)}</span>
        </div>
      ))}
    </Card>
  );
}
