export function stockAnalysisPrompt(payload: unknown) {
  return `Analyze whether this stock is in a top formation or distribution phase. Use the supplied OHLCV summary, stage scores, indicators, and price-volume relationship. Explain the likely smart money behavior, risk level, invalidation conditions, and suggested action. Do not invent numbers.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function screenerExplanationPrompt(payload: unknown) {
  return `Explain why these symbols passed the screener. Focus on technical structure, signal alignment, and risk considerations.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function backtestExplanationPrompt(payload: unknown) {
  return `Explain this backtest result using the provided performance metrics, drawdown profile, and trade summary. Highlight strengths, weaknesses, overfitting risks, and practical trading considerations.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function strategyExplanationPrompt(payload: unknown) {
  return `Explain this strategy in plain English. Describe how it enters, exits, manages risk, and in what market regimes it may perform well or poorly.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}
