export type MarketDataProviderName = "tushare" | "rqdata";

export type NormalizedCandle = {
  symbol: string;
  exchange: "SSE" | "SZSE" | "BSE" | "UNKNOWN";
  ts: string;
  timeframe: "1m" | "5m" | "15m" | "30m" | "60m" | "1d";
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount?: number;
  source: MarketDataProviderName;
};

export type RealtimeQuoteSnapshot = {
  symbol: string;
  ts: string;
  last?: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
  amount?: number;
  bidAskAvailable?: boolean;
  source: MarketDataProviderName;
};

export interface MarketDataProvider {
  getMinuteCandles(params: {
    symbols: string[];
    timeframe: "1m" | "5m" | "15m" | "30m" | "60m";
  }): Promise<NormalizedCandle[]>;

  getDailyCandles?(params: {
    symbols: string[];
    startDate?: string;
    endDate?: string;
  }): Promise<NormalizedCandle[]>;

  getRealtimeSnapshot?(params: {
    symbols: string[];
  }): Promise<RealtimeQuoteSnapshot[]>;
}

export type DataFreshness = "LIVE" | "DELAYED" | "STALE" | "UNAVAILABLE";
