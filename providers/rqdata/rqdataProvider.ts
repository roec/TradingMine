import { MarketDataProvider } from "@/core/market-data/types";

export const rqdataProvider: MarketDataProvider = {
  async getMinuteCandles() {
    throw new Error("RQData adapter not enabled. Set RQDATA_ENABLED=true and implement gateway credentials.");
  },
  async getDailyCandles() {
    throw new Error("RQData daily adapter not enabled.");
  },
  async getRealtimeSnapshot() {
    throw new Error("RQData snapshot adapter not enabled.");
  }
};
