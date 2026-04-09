import { BacktestResult, Candle, StrategyConfig, Trade } from "@/core/types/domain";
import { evaluateConditions } from "@/core/strategies/engine";

export type EngineInput = {
  candlesBySymbol: Record<string, Candle[]>;
  rowsBySymbol: Record<string, Array<Record<string, number | boolean | string>>>;
  strategy: StrategyConfig;
  initialCapital: number;
  feeBps: number;
  slippageBps: number;
  maxConcurrentPositions: number;
};

type Position = Trade & { holdingDays: number };

export function runBacktest(input: EngineInput): BacktestResult {
  const symbols = Object.keys(input.candlesBySymbol);
  const dateCount = Math.min(...symbols.map((s) => input.candlesBySymbol[s].length));

  let cash = input.initialCapital;
  const positions = new Map<string, Position>();
  const trades: Trade[] = [];
  const equityCurve: Array<{ date: string; equity: number; drawdown: number }> = [];

  for (let i = 0; i < dateCount; i += 1) {
    for (const symbol of symbols) {
      const candle = input.candlesBySymbol[symbol][i];
      const row = input.rowsBySymbol[symbol][i];
      const pos = positions.get(symbol);
      if (pos) {
        pos.holdingDays += 1;
        const stopPrice = pos.entryPrice * (1 - input.strategy.risk.stopLossPct);
        const takePrice = pos.entryPrice * (1 + input.strategy.risk.takeProfitPct);
        const shouldExit =
          evaluateConditions(row, input.strategy.exit) ||
          candle.close <= stopPrice ||
          candle.close >= takePrice ||
          pos.holdingDays >= input.strategy.risk.maxHoldingDays;
        if (shouldExit) {
          const fill = withSlippage(candle.close, input.slippageBps, "sell");
          const fee = (fill * pos.quantity * input.feeBps) / 10000;
          cash += fill * pos.quantity - fee;
          pos.exitDate = candle.timestamp;
          pos.exitPrice = fill;
          pos.pnl = (fill - pos.entryPrice) * pos.quantity - fee;
          pos.reason = "rule_or_risk_exit";
          trades.push({ ...pos });
          positions.delete(symbol);
        }
      } else if (positions.size < input.maxConcurrentPositions && evaluateConditions(row, input.strategy.entry)) {
        const capitalPerTrade = cash * input.strategy.risk.positionSizePct;
        const fill = withSlippage(candle.close, input.slippageBps, "buy");
        const quantity = Math.floor(capitalPerTrade / fill);
        if (quantity > 0) {
          const fee = (fill * quantity * input.feeBps) / 10000;
          cash -= fill * quantity + fee;
          positions.set(symbol, {
            symbol,
            entryDate: candle.timestamp,
            entryPrice: fill,
            quantity,
            holdingDays: 0
          });
        }
      }
    }

    const date = input.candlesBySymbol[symbols[0]][i].timestamp;
    const positionValue = [...positions.values()].reduce((sum, p) => {
      const px = input.candlesBySymbol[p.symbol][i].close;
      return sum + px * p.quantity;
    }, 0);
    const equity = cash + positionValue;
    const peak = Math.max(equity, ...(equityCurve.map((x) => x.equity) || [equity]));
    const drawdown = peak === 0 ? 0 : (equity - peak) / peak;
    equityCurve.push({ date, equity, drawdown });
  }

  const dailyPnl = equityCurve.map((point, idx, arr) => ({
    date: point.date,
    pnl: idx === 0 ? 0 : point.equity - arr[idx - 1].equity
  }));

  const metrics = computeMetrics(equityCurve, trades, input.initialCapital);
  return { equityCurve, dailyPnl, trades, metrics };
}

function withSlippage(price: number, bps: number, side: "buy" | "sell") {
  const impact = (price * bps) / 10000;
  return side === "buy" ? price + impact : price - impact;
}

function computeMetrics(
  equityCurve: Array<{ date: string; equity: number; drawdown: number }>,
  trades: Trade[],
  initialCapital: number
) {
  const final = equityCurve.at(-1)?.equity ?? initialCapital;
  const totalReturn = final / initialCapital - 1;
  const years = Math.max(equityCurve.length / 252, 1 / 252);
  const cagr = Math.pow(final / initialCapital, 1 / years) - 1;
  const maxDrawdown = Math.min(...equityCurve.map((x) => x.drawdown), 0);

  const returns = equityCurve.slice(1).map((x, i) => x.equity / equityCurve[i].equity - 1);
  const mean = avg(returns);
  const sd = std(returns);
  const downside = std(returns.filter((r) => r < 0));
  const sharpe = sd === 0 ? 0 : (Math.sqrt(252) * mean) / sd;
  const sortino = downside === 0 ? 0 : (Math.sqrt(252) * mean) / downside;

  const closed = trades.filter((t) => typeof t.pnl === "number") as Array<Trade & { pnl: number }>;
  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl <= 0);
  const averageGain = wins.length ? avg(wins.map((t) => t.pnl)) : 0;
  const averageLoss = losses.length ? avg(losses.map((t) => t.pnl)) : 0;
  const grossProfit = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));

  return {
    totalReturn,
    cagr,
    maxDrawdown,
    sharpe,
    sortino,
    winRate: closed.length ? wins.length / closed.length : 0,
    averageGain,
    averageLoss,
    profitFactor: grossLoss === 0 ? 0 : grossProfit / grossLoss,
    turnover: closed.length / Math.max(equityCurve.length, 1),
    exposure: equityCurve.filter((x) => x.equity !== 0).length / Math.max(equityCurve.length, 1)
  };
}

const avg = (v: number[]) => v.reduce((a, b) => a + b, 0) / Math.max(v.length, 1);
const std = (v: number[]) => {
  if (v.length === 0) return 0;
  const m = avg(v);
  return Math.sqrt(avg(v.map((x) => (x - m) ** 2)));
};
