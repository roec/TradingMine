import Link from "next/link";
import { Card } from "@/components/ui";
import { getUniverseRows } from "@/lib/service";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function ScreenersPage() {
  const locale = await getCurrentLocale();
  const rows = getUniverseRows();
  return (
    <Card title={t(locale, "screenersSaved")}>
      <div className="mb-4 text-sm text-slate-300">{t(locale, "screenersDescription")}</div>
      <table className="w-full text-sm">
        <thead className="text-slate-400">
          <tr>
            <th className="text-left">{t(locale, "symbol")}</th>
            <th>HighPos</th>
            <th>TopExitScore</th>
            <th>{t(locale, "risk")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.symbol} className="border-t border-slate-800">
              <td>
                <Link href={`/screeners/default?symbol=${r.symbol}`} className="text-accent">
                  {r.symbol}
                </Link>
              </td>
              <td className="text-center">{r.HighPos.toFixed(2)}</td>
              <td className="text-center">{r.TopExitScore.toFixed(2)}</td>
              <td className="text-center">{r.riskLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
