import Link from "next/link";
import { Card } from "@/components/ui";

export default function BacktestsPage() {
  return (
    <Card title="Backtest Runs">
      <div className="flex items-center justify-between rounded-lg bg-slate-900/40 p-3">
        <div>
          <div className="font-medium">Trend Following Demo</div>
          <div className="text-xs text-slate-400">Universe: all_symbols | Daily bars | Paper simulation</div>
        </div>
        <Link href="/backtests/demo" className="text-accent">Inspect</Link>
      </div>
    </Card>
  );
}
