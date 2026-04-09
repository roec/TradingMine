import { Candle, SymbolMeta } from "@/core/types/domain";

export interface MarketDataProvider {
  getSymbols(): Promise<SymbolMeta[]>;
  getCandles(symbol: string): Promise<Candle[]>;
}

export class MockMarketDataProvider implements MarketDataProvider {
  constructor(private symbols: SymbolMeta[], private candles: Record<string, Candle[]>) {}

  async getSymbols() {
    return this.symbols;
  }

  async getCandles(symbol: string) {
    return this.candles[symbol] ?? [];
  }
}

export class CsvMarketDataProvider implements MarketDataProvider {
  constructor(private rows: Candle[], private symbols: SymbolMeta[]) {}

  async getSymbols() {
    return this.symbols;
  }

  async getCandles(symbol: string) {
    return this.rows.filter((r) => r.symbol === symbol);
  }
}

export class FutureApiProvider implements MarketDataProvider {
  async getSymbols(): Promise<SymbolMeta[]> {
    throw new Error("Not implemented. Plug your live vendor API here.");
  }

  async getCandles(): Promise<Candle[]> {
    throw new Error("Not implemented. Plug your live vendor API here.");
  }
}
