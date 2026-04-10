import { StockChart } from "@/components/stock-chart";
import { Badge, Card } from "@/components/ui";
import { buildLatestRow } from "@/lib/analytics";
import { getCandles } from "@/lib/market-data";
import { t, tf } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";
import { getActiveProviderName } from "@/core/market-data/providerRegistry";
import { fetchChinaRealtimeQuote } from "@/lib/china-market-data";

type PageProps = {
  params: Promise<{ ticker: string }>;
};

export default async function StockDetailPage({ params }: PageProps) {
  const locale = await getCurrentLocale();
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();
  const candles = await getCandles(symbol);
  const row = buildLatestRow(candles);
  const provider = getActiveProviderName();

  let realtime = null as Awaited<ReturnType<typeof fetchChinaRealtimeQuote>> | null;
  try {
    realtime = await fetchChinaRealtimeQuote(symbol.includes(".") ? symbol.split(".")[0] : symbol);
  } catch {
    realtime = null;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card title={t(locale, "stockBoardBadge")}>
          <div className="text-xl font-bold">{row.boardType}</div>
        </Card>
        <Card title="Realtime Status">
          <div className="text-sm text-slate-300">LIVE / Provider: {provider}</div>
          <div className="text-xs text-slate-400">Last candle: {candles.at(-1)?.timestamp ?? "N/A"}</div>
        </Card>
        <Card title={t(locale, "stockStage")}>
          <div className="text-3xl font-bold">{row.stage}</div>
        </Card>
        <Card title={t(locale, "stockTopExitScore")}>
          <div className="text-3xl font-bold">{row.TopExitScore.toFixed(2)}</div>
        </Card>
      </div>

      {realtime && (
        <Card title="Latest Snapshot">
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span>Last: {realtime.last?.toFixed(2)}</span>
            <span>Change: {realtime.pctChange.toFixed(2)}%</span>
            <span>Timestamp: {realtime.timestamp}</span>
            <button className="rounded-md bg-accent/20 px-2 py-1 text-accent">Refresh AI Explanation</button>
          </div>
        </Card>
      )}

      <Card title={`Chart: ${symbol}`}>
        <StockChart data={candles.map((c) => ({ time: c.timestamp, ...c }))} />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title={t(locale, "limitBoardSignals")}>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>{t(locale, "limitUpToday")}: {String(row.limitUpToday)}</li>
            <li>{t(locale, "consecutiveBoards")}: {row.consecutiveLimitUpCount}</li>
            <li>{t(locale, "failedBoard")}: {String(row.failedBoardToday)} ({row.failedBoardSeverity})</li>
            <li>{t(locale, "reSeal")}: {String(row.reSealToday)}</li>
            <li>{t(locale, "oneWordBoard")}: {String(row.oneWordBoard)}</li>
            <li>{t(locale, "limitBoardScore")}: {row.limitBoardScore.toFixed(2)}</li>
          </ul>
        </Card>
        <Card title={t(locale, "macdKdjMaPanel")}>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>MACD DIF/DEA/HIST: {row.macdDif.toFixed(3)} / {row.macdDea.toFixed(3)} / {row.macdHist.toFixed(3)}</li>
            <li>MACD Golden Cross: {String(row.macdGoldenCross)}</li>
            <li>KDJ K/D/J: {row.k.toFixed(2)} / {row.d.toFixed(2)} / {row.j.toFixed(2)}</li>
            <li>Above MA60: {String(row.close_above_ma60)}</li>
            <li>MA60 Rising: {String(row.ma60Rising)}</li>
            <li>MA Bullish Alignment: {String(row.maBullish)}</li>
          </ul>
        </Card>
        <Card title={t(locale, "chipEmotionTurnoverPanel")}>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>{t(locale, "turnoverRate")}: {(row.turnoverRate * 100).toFixed(2)}%</li>
            <li>{t(locale, "turnoverSpike")}: {row.turnoverSpike.toFixed(2)}</li>
            <li>{t(locale, "chipPeakPrice")}: {row.chipPeakPrice.toFixed(2)}</li>
            <li>{t(locale, "chipConcentration")}: {(row.chipConcentrationRatio * 100).toFixed(1)}%</li>
            <li>Chip Pressure Score: {row.chipPressureScore.toFixed(2)}</li>
            <li>{t(locale, "winnerRatioProxy")}: {(row.winnerRatioProxy * 100).toFixed(1)}%</li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title={t(locale, "stockAiExplanation")}>
          <p className="text-sm text-slate-300">{tf(locale, "stockAiText", { stage: row.stage, score: row.TopExitScore.toFixed(2) })}</p>
        </Card>
        <Card title={t(locale, "stockStrategyCompatibility")}>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>{t(locale, "trendFollowing")}: {row.close_above_ma20 ? t(locale, "compatible") : t(locale, "notIdeal")}</li>
            <li>{t(locale, "topExitAvoidance")}: {row.TopExitScore < 0.45 ? t(locale, "compatible") : t(locale, "notIdeal")}</li>
            <li>{t(locale, "meanReversion")}: {row.rsi14 < 30 ? t(locale, "candidate") : t(locale, "neutral")}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
