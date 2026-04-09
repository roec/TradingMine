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
      <Card title={t(locale, "settingsBacktestTitle")}>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>{t(locale, "settingsFee")}: 5 bps</li>
          <li>{t(locale, "settingsSlippage")}: 3 bps</li>
          <li>{t(locale, "settingsInitialCapital")}: $100,000</li>
        </ul>
      </Card>
    </div>
  );
}
