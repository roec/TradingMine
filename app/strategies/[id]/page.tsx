import { Card } from "@/components/ui";
import { strategyTemplates } from "@/core/strategies/engine";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StrategyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const strategy = strategyTemplates[Number(id)] || strategyTemplates[0];
  return (
    <div className="space-y-4">
      <Card title={strategy.name}>
        <pre className="overflow-auto rounded-lg bg-slate-900 p-4 text-xs">{JSON.stringify(strategy, null, 2)}</pre>
      </Card>
      <Card title="AI Interpretation">
        <p className="text-sm text-slate-300">This strategy buys aligned trend signals and exits on deterioration or risk triggers.</p>
      </Card>
    </div>
  );
}
