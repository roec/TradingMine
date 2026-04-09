import { StockChart } from "@/components/stock-chart";
import { Badge, Card } from "@/components/ui";
import { buildLatestRow } from "@/lib/analytics";
import { getCandles } from "@/lib/market-data";
import { t, tf } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";

type PageProps = {
  params: Promise<{ ticker: string }>;
};

export default async function StockDetailPage({ params }: PageProps) {
  const locale = await getCurrentLocale();
  const { ticker } = await params;
  const candles = await getCandles(ticker.toUpperCase());
  const row = buildLatestRow(candles);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card title="Board Badge">
          <div className="text-xl font-bold">{row.boardType}</div>
        </Card>
        <Card title={t(locale, "stockStage")}>
          <div className="text-3xl font-bold">{row.stage}</div>
        </Card>
        <Card title={t(locale, "stockTopExitScore")}>
          <div className="text-3xl font-bold">{row.TopExitScore.toFixed(2)}</div>
        </Card>
        <Card title={t(locale, "stockRisk")}>
          <Badge value={row.riskLevel} />
        </Card>
      </div>

      <Card title={`Chart: ${ticker.toUpperCase()}`}>
        <StockChart data={candles.map((c) => ({ time: c.timestamp, ...c }))} />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Limit Board Signals">
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Limit-Up Today: {String(row.limitUpToday)}</li>
            <li>Consecutive Boards: {row.consecutiveLimitUpCount}</li>
            <li>Failed Board: {String(row.failedBoardToday)} ({row.failedBoardSeverity})</li>
            <li>Re-Seal: {String(row.reSealToday)}</li>
            <li>One-Word Board: {String(row.oneWordBoard)}</li>
            <li>LimitBoardScore: {row.limitBoardScore.toFixed(2)}</li>
          </ul>
        </Card>
        <Card title="MACD / KDJ / MA Structure">
          <ul className="space-y-1 text-sm text-slate-300">
            <li>MACD DIF/DEA/HIST: {row.macdDif.toFixed(3)} / {row.macdDea.toFixed(3)} / {row.macdHist.toFixed(3)}</li>
            <li>MACD Golden Cross: {String(row.macdGoldenCross)}</li>
            <li>KDJ K/D/J: {row.k.toFixed(2)} / {row.d.toFixed(2)} / {row.j.toFixed(2)}</li>
            <li>Above MA60: {String(row.close_above_ma60)}</li>
            <li>MA60 Rising: {String(row.ma60Rising)}</li>
            <li>MA Bullish Alignment: {String(row.maBullish)}</li>
          </ul>
        </Card>
        <Card title="Chip Distribution / Emotion / Turnover">
          <ul className="space-y-1 text-sm text-slate-300">
            <li>Turnover Rate: {(row.turnoverRate * 100).toFixed(2)}%</li>
            <li>Turnover Spike: {row.turnoverSpike.toFixed(2)}</li>
            <li>Chip Peak Price: {row.chipPeakPrice.toFixed(2)}</li>
            <li>Chip Concentration: {(row.chipConcentrationRatio * 100).toFixed(1)}%</li>
            <li>Chip Pressure Score: {row.chipPressureScore.toFixed(2)}</li>
            <li>Winner Ratio Proxy: {(row.winnerRatioProxy * 100).toFixed(1)}%</li>
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
