import { MarketDataProviderName } from "@/core/market-data/types";
import { tushareProvider } from "@/providers/tushare/tushareProvider";
import { rqdataProvider } from "@/providers/rqdata/rqdataProvider";

export const providerRegistry = {
  tushare: tushareProvider,
  rqdata: rqdataProvider
};

export function getActiveProviderName(): MarketDataProviderName {
  const configured = (process.env.MARKET_DATA_PROVIDER || "tushare") as MarketDataProviderName;
  if (configured === "rqdata" && process.env.RQDATA_ENABLED !== "true") {
    return "tushare";
  }
  return configured;
}
