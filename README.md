# TradingMine: AI-Assisted Stock Trading Workstation

A full-stack trading research and simulation platform built with **Next.js App Router + TypeScript + Tailwind + Prisma/PostgreSQL + Redis**, featuring deterministic quantitative scoring, stock screening, strategy simulation, backtesting, and unified LLM explanations (**OpenAI/DeepSeek switchable**).

## Architecture

- `app/` Next.js pages and API routes
- `core/` deterministic domain engines (indicators, signals, screening, strategies, backtest, AI adapters)
- `lib/` data services, sample providers, Prisma/Redis clients
- `store/` Zustand client state
- `prisma/` schema and seed script
- `tests/` Vitest unit tests

## Features Implemented

- Dashboard with market overview, risk signals, screened opportunities, strategy snapshots, AI insight feed
- Stock detail page with stage A/B/C, TopExitScore, risk badge, chart, strategy compatibility, AI commentary
- Deterministic top detection scoring (`Score_A/B/C`, `TopExitScore`, risk mapping)
- Composable stock screener with condition parsing and ranking
- Strategy builder engine + six built-in templates
- Bar-based long-only multi-symbol backtest engine
- Runnable strategy simulation endpoint
- Unified LLM adapter for OpenAI and DeepSeek
- Settings page for provider/model/base URL defaults
- Mock + CSV provider abstractions for future live integration

## Quick Start

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open: `http://localhost:3000/dashboard`

## Docker Deployment

```bash
docker compose up --build
```

Services:
- App: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## LLM Switching (OpenAI / DeepSeek)

Use environment variables:

```env
LLM_PROVIDER=openai
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5

DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-chat
```

Set `LLM_PROVIDER=deepseek` to switch providers. All AI endpoints call `core/ai/llm.ts`.

## China A-Share Enhanced Modules

This system now includes dedicated China A-share logic in deterministic domain modules:

- `core/china/marketRules.ts`: session states, auction windows, cancel constraints
- `core/china/boardRules.ts`: board limits (SSE/SZSE/ChiNext/STAR/BSE) and no-limit IPO windows
- `core/china/limitSignals.ts`: limit-up/down, failed-board, re-seal, one-word-board, consecutive boards, limit board score
- `core/china/technical.ts`: KDJ, Bollinger Bands, MACD state signals
- `core/china/chipDistribution.ts`: heuristic chip distribution approximation
- `core/china/emotionCycle.ts`: deterministic market emotion phase classifier
- `core/china/screeners.ts`: China-style prebuilt screener templates
- `core/china/strategyTemplates.ts`: China-specific strategy templates

### Chip Distribution Note

Chip distribution outputs are heuristic approximations derived from OHLCV/turnover and are **not** broker-level real chip ledgers unless specialized data feeds are integrated.

## Market Data Source


### China Live Data Provider

- When `MARKET=CN_A_SHARE`, the system fetches China A-share daily candles from Eastmoney and realtime snapshots from Tencent quote endpoint.
- If live requests fail, it automatically falls back to local sample candles.

### UI Language Switching

- UI supports English/Chinese switching from the top-right language selector.
- Locale is stored by cookie and applied to all pages through the App Router layout.
- Default mode is `MARKET_DATA_MODE=live`, which fetches factual daily OHLCV data from Stooq (no API key required).
- Set `MARKET_DATA_MODE=mock` to force offline demo data from `lib/sampleData.ts`.
- Live fetch logic lives in `lib/market-data.ts` and falls back to mock data automatically when provider requests fail.

## Backtests

- API: `POST /api/backtests`
- Inputs include strategy, fees, slippage, position sizing and max concurrent positions
- Outputs include equity curve, daily pnl, trades, return/risk metrics

## Screeners

- API: `POST /api/screeners`
- Pass JSON conditions array:

```json
{
  "conditions": [
    { "indicator": "HighPos", "op": ">", "value": 0.8 },
    { "indicator": "TopExitScore", "op": "<", "value": 0.4 }
  ]
}
```

## AI Assistant Workflows

- `POST /api/ai` with unified chat messages payload
- Prompt builders are in `core/ai/prompts.ts`:
  - stock analysis
  - screener explanation
  - backtest explanation
  - strategy explanation

## Determinism Statement

All indicators, scores, signals, screening, and backtest computations are deterministic and reproducible. LLMs are used only for narrative interpretation.

## Testing

```bash
npm run test
```

Covers:
- indicator calculations
- top detection determinism
- screener filtering
- strategy validation/evaluation
- backtest calculations
- LLM adapter failure behavior
