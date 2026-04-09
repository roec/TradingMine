import { Candle } from "@/core/types/domain";

function getEastmoneySecid(symbol: string) {
  if (symbol.startsWith("6") || symbol.startsWith("9")) return `1.${symbol}`;
  if (symbol.startsWith("8") || symbol.startsWith("4")) return `0.${symbol}`;
  return `0.${symbol}`;
}

export async function fetchChinaDailyCandles(symbol: string, limit = 240): Promise<Candle[]> {
  const secid = getEastmoneySecid(symbol);
  const url = `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}&klt=101&fqt=1&lmt=${limit}&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Eastmoney kline failed: ${response.status}`);
  const json = await response.json();
  const klines: string[] = json?.data?.klines ?? [];

  return klines.map((line) => {
    const [date, open, close, high, low, volume] = line.split(",");
    return {
      symbol,
      timestamp: new Date(`${date}T00:00:00.000+08:00`).toISOString(),
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume)
    } satisfies Candle;
  });
}

export type ChinaRealtimeQuote = {
  symbol: string;
  name: string;
  last: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  amount: number;
  pctChange: number;
  timestamp: string;
};

export async function fetchChinaRealtimeQuote(symbol: string): Promise<ChinaRealtimeQuote> {
  const marketPrefix = symbol.startsWith("6") ? "sh" : "sz";
  const response = await fetch(`https://qt.gtimg.cn/q=${marketPrefix}${symbol}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Tencent quote failed: ${response.status}`);
  const text = await response.text();
  const parts = text.split("~");
  if (parts.length < 40) throw new Error("Invalid realtime quote payload.");

  const name = parts[1] || symbol;
  const last = Number(parts[3] || 0);
  const prevClose = Number(parts[4] || 0);
  const open = Number(parts[5] || 0);
  const volume = Number(parts[6] || 0);
  const amount = Number(parts[37] || 0);
  const high = Number(parts[33] || last);
  const low = Number(parts[34] || last);
  const date = parts[30] || "";
  const timestamp = date.length >= 14
    ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${date.slice(8, 10)}:${date.slice(10, 12)}:${date.slice(12, 14)}+08:00`
    : new Date().toISOString();

  return {
    symbol,
    name,
    last,
    open,
    high,
    low,
    prevClose,
    volume,
    amount,
    pctChange: prevClose ? (last / prevClose - 1) * 100 : 0,
    timestamp: new Date(timestamp).toISOString()
  };
}
