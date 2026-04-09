export type LLMProvider = "openai" | "deepseek";

export const llmConfig = {
  provider: (process.env.LLM_PROVIDER || "openai") as LLMProvider,
  openai: {
    baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-5"
  },
  deepseek: {
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat"
  }
};

export async function callLLM(messages: Array<{ role: string; content: string }>) {
  const provider = llmConfig.provider;
  const cfg = provider === "openai" ? llmConfig.openai : llmConfig.deepseek;

  const response = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`LLM request failed: ${response.status}`);
  }

  return response.json();
}
