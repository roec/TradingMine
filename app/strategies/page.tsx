import Link from "next/link";
import { Card } from "@/components/ui";
import { strategyTemplates } from "@/core/strategies/engine";

export default function StrategiesPage() {
  return (
    <Card title="Strategy Templates">
      <ul className="space-y-2">
        {strategyTemplates.map((s, i) => (
          <li key={s.name} className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2">
            <span>{s.name}</span>
            <Link href={`/strategies/${i}`} className="text-accent">Open</Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
