import { Card } from "@/components/ui";
import { llmConfig } from "@/core/ai/llm";

export default async function SettingsPage() {
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
      <Card title="China A-Share Engine Settings">
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Market: CN_A_SHARE</li>
          <li>T+1 Enforcement: ON</li>
          <li>Limit-Up/Down Fill Model: realistic</li>
          <li>Strict Session Handling: ON</li>
          <li>Emotion Threshold Profile: default_cn_v1</li>
          <li>Chip Distribution Approximation: enabled (heuristic)</li>
        </ul>
      </Card>
    </div>
  );
}
