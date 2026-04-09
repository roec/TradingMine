export function stockAnalysisPrompt(payload: unknown) {
  return `Analyze this China A-share stock setup using deterministic inputs only. Explain whether it is in strong trend, speculative expansion, distribution, or breakdown. Evaluate limit-up quality, failed board risk, re-seal strength, MA support/failure, MACD/KDJ confirmation, chip pressure, market emotion-cycle support, invalidation conditions, and suggested action. Do not invent numbers.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function screenerExplanationPrompt(payload: unknown) {
  return `Explain why these symbols passed the China-style screener. Include board type, limit-up/failed-board behavior, turnover profile, MA/MACD/KDJ alignment, chip pressure and emotion phase context.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function backtestExplanationPrompt(payload: unknown) {
  return `Explain this A-share backtest with focus on T+1 constraints, board price limits, fill difficulty at limit-up/limit-down, and regime sensitivity (expansion/rotation/distribution). Highlight strengths, weaknesses, and practical risk controls.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function strategyExplanationPrompt(payload: unknown) {
  return `Explain this China A-share strategy in plain English, including entry/exit logic, risk model, and expected behavior across emotion phases. Mention when to avoid execution (failed board risk, high chip pressure, top distribution warning).\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}

export function riskExplanationPrompt(payload: unknown) {
  return `Provide a focused risk explanation for this China A-share setup: failed board risk, chip pressure risk, stage B/C top-distribution risk, and weak market emotion risk. Do not invent numbers.\n\nData:\n${JSON.stringify(
    payload,
    null,
    2
  )}`;
}
