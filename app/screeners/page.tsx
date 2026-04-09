import Link from "next/link";
import { Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";

export default async function ScreenersPage() {
  const rows = await getUniverseRows();
  return (
    <Card title="China A-Share Screeners">
      <div className="mb-4 text-sm text-slate-300">Board-aware screener table with limit-board, turnover, MACD/KDJ, chip pressure and emotion fields.</div>
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left">Symbol</th>
              <th>Board</th>
              <th>Turnover Rate</th>
              <th>Limit-Up</th>
              <th>Consecutive Boards</th>
              <th>Failed Board</th>
              <th>Re-Seal</th>
              <th>MA60 Trend</th>
              <th>MACD State</th>
              <th>KDJ State</th>
              <th>Chip Pressure</th>
              <th>Emotion Phase</th>
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
                <td className="text-center">{Boolean(r.ma60Rising) ? "Rising" : "Flat/Down"}</td>
                <td className="text-center">{Boolean(r.macdGoldenCross) ? "Golden" : Boolean(r.macdDeathCross) ? "Death" : "Neutral"}</td>
                <td className="text-center">{Number(r.k) > Number(r.d) ? "Golden" : "Death/Neutral"}</td>
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
