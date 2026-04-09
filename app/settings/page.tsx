import { Card } from "@/components/ui";
import { llmConfig } from "@/core/ai/llm";
import { getCurrentLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function SettingsPage() {
  const locale = await getCurrentLocale();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title={t(locale, "settingsLlmTitle")}>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>{t(locale, "provider")}: {llmConfig.provider}</li>
          <li>{t(locale, "openaiModel")}: {llmConfig.openai.model}</li>
          <li>{t(locale, "deepseekModel")}: {llmConfig.deepseek.model}</li>
          <li>{t(locale, "settingsSecrets")}</li>
        </ul>
      </Card>
      <Card title={t(locale, "chinaEngineSettings")}>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>Market: CN_A_SHARE</li>
          <li>{t(locale, "tPlusOneEnforcement")}: ON</li>
          <li>Limit-Up/Down Fill Model: realistic</li>
          <li>{t(locale, "strictSessionHandling")}: ON</li>
          <li>{t(locale, "emotionThresholdProfile")}: default_cn_v1</li>
          <li>{t(locale, "chipApproximation")}: enabled (heuristic)</li>
        </ul>
      </Card>
    </div>
  );
}
