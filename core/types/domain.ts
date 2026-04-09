export type Timeframe = "1d" | "1w" | "1m";

export type SymbolMeta = {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
};

export type Candle = {
  symbol: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type IndicatorPoint = {
  timestamp: string;
  values: Record<string, number | boolean>;
};

export type TopStage = "A" | "B" | "C";
export type TopRiskLevel = "Normal" | "Warning" | "Reduce" | "Exit";

export type TopDetectionResult = {
  stage: TopStage;
  scoreA: number;
  scoreB: number;
  scoreC: number;
  topExitScore: number;
  highPos: number;
  riskLevel: TopRiskLevel;
  flags: Record<string, boolean>;
};

export type ScreenerCondition = {
  indicator: string;
  op: ">" | ">=" | "<" | "<=" | "=" | "!=";
  value: number | boolean | string;
};

export type StrategyConfig = {
  name: string;
  universe: string;
  entry: ScreenerCondition[];
  exit: ScreenerCondition[];
  risk: {
    stopLossPct: number;
    takeProfitPct: number;
    maxHoldingDays: number;
    positionSizePct: number;
  };
};

export type Trade = {
  symbol: string;
  entryDate: string;
  entryPrice: number;
  exitDate?: string;
  exitPrice?: number;
  quantity: number;
  pnl?: number;
  reason?: string;
};

export type BacktestMetrics = {
  totalReturn: number;
  cagr: number;
  maxDrawdown: number;
  sharpe: number;
  sortino: number;
  winRate: number;
  averageGain: number;
  averageLoss: number;
  profitFactor: number;
  turnover: number;
  exposure: number;
};

export type BacktestResult = {
  equityCurve: Array<{ date: string; equity: number; drawdown: number }>;
  dailyPnl: Array<{ date: string; pnl: number }>;
  trades: Trade[];
  metrics: BacktestMetrics;
};
