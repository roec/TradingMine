import { MarketDataProvider, NormalizedCandle, RealtimeQuoteSnapshot } from "@/core/market-data/types";
import { callTushare } from "@/providers/tushare/tushareClient";

const TF_MAP = {
  "1m": "1MIN",
  "5m": "5MIN",
  "15m": "15MIN",
  "30m": "30MIN",
  "60m": "60MIN"
} as const;

function inferExchange(tsCode: string): NormalizedCandle["exchange"] {
  if (tsCode.endsWith(".SH")) return "SSE";
  if (tsCode.endsWith(".SZ")) return "SZSE";
  if (tsCode.endsWith(".BJ")) return "BSE";
  return "UNKNOWN";
}

export const tushareProvider: MarketDataProvider = {
  async getMinuteCandles({ symbols, timeframe }) {
    const token = process.env.TUSHARE_TOKEN || "";
    if (!token) throw new Error("TUSHARE_TOKEN is missing.");

    const tsCodes = symbols.join(",");
    const resp = await callTushare({
      api_name: "rt_min",
      token,
      params: { ts_code: tsCodes, freq: TF_MAP[timeframe] },
      fields: "ts_code,trade_time,open,high,low,close,vol,amount"
    });

    const fields: string[] = resp?.data?.fields ?? [];
    const items: any[][] = resp?.data?.items ?? [];

    return items.map((row) => {
      const record = Object.fromEntries(fields.map((f, i) => [f, row[i]]));
      return {
        symbol: String(record.ts_code),
        exchange: inferExchange(String(record.ts_code)),
        ts: new Date(String(record.trade_time).replace(" ", "T") + "+08:00").toISOString(),
        timeframe,
        open: Number(record.open),
        high: Number(record.high),
        low: Number(record.low),
        close: Number(record.close),
        volume: Number(record.vol),
        amount: Number(record.amount),
        source: "tushare"
      } as NormalizedCandle;
    });
  },

  async getRealtimeSnapshot({ symbols }) {
    const candles = await this.getMinuteCandles({ symbols, timeframe: "1m" });
    const grouped = new Map<string, NormalizedCandle>();
    for (const c of candles) grouped.set(c.symbol, c);
    return [...grouped.values()].map((c) => ({
      symbol: c.symbol,
      ts: c.ts,
      last: c.close,
      open: c.open,
      high: c.high,
      low: c.low,
      volume: c.volume,
      amount: c.amount,
      source: "tushare"
    } as RealtimeQuoteSnapshot));
  }
};
