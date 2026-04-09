import { Card } from "@/components/ui";
import { llmConfig } from "@/core/ai/llm";

export default function SettingsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="LLM Provider Settings">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Provider: {llmConfig.provider}</li>
          <li>OpenAI Model: {llmConfig.openai.model}</li>
          <li>DeepSeek Model: {llmConfig.deepseek.model}</li>
          <li>Secrets are server-side via environment variables.</li>
        </ul>
      </Card>
      <Card title="Backtest Defaults">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Fee: 5 bps</li>
          <li>Slippage: 3 bps</li>
          <li>Initial Capital: $100,000</li>
        </ul>
      </Card>
    </div>
  );
}
