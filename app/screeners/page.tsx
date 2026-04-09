import Link from "next/link";
import { Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function ScreenersPage() {
  const locale = await getCurrentLocale();
  const rows = await getUniverseRows();
  return (
    <Card title={t(locale, "chinaAShareScreeners")}>
      <div className="mb-4 text-sm text-slate-300">{t(locale, "screenerDescBoardAware")}</div>
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left">{t(locale, "symbol")}</th>
              <th>{t(locale, "board")}</th>
              <th>{t(locale, "turnoverRate")}</th>
              <th>{t(locale, "limitUp")}</th>
              <th>{t(locale, "consecutiveBoards")}</th>
              <th>{t(locale, "failedBoard")}</th>
              <th>{t(locale, "reSeal")}</th>
              <th>{t(locale, "ma60Trend")}</th>
              <th>{t(locale, "macdState")}</th>
              <th>{t(locale, "kdjState")}</th>
              <th>{t(locale, "chipPressure")}</th>
              <th>{t(locale, "emotionPhase")}</th>
              <th>TopExitScore</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} className="border-t border-slate-800">
                <td>
                  <Link href={`/stocks/${r.symbol}`} className="text-accent">{r.symbol}</Link>
                </td>
                <td className="text-center">{String(r.boardType)}</td>
                <td className="text-center">{(Number(r.turnoverRate) * 100).toFixed(2)}%</td>
                <td className="text-center">{String(r.limitUpToday)}</td>
                <td className="text-center">{Number(r.consecutiveLimitUpCount)}</td>
                <td className="text-center">{String(r.failedBoardToday)}</td>
                <td className="text-center">{String(r.reSealToday)}</td>
                <td className="text-center">{Boolean(r.ma60Rising) ? t(locale, "rising") : t(locale, "flatDown")}</td>
                <td className="text-center">{Boolean(r.macdGoldenCross) ? t(locale, "golden") : Boolean(r.macdDeathCross) ? t(locale, "death") : t(locale, "neutralState")}</td>
                <td className="text-center">{Number(r.k) > Number(r.d) ? t(locale, "golden") : `${t(locale, "death")}/${t(locale, "neutralState")}`}</td>
                <td className="text-center">{Number(r.chipPressureScore).toFixed(2)}</td>
                <td className="text-center">{Number(r.turnoverSpike) > 1.5 ? "Speculative Expansion" : "Rotation"}</td>
                <td className="text-center">{Number(r.TopExitScore).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
