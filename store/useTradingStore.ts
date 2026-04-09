"use client";

import { create } from "zustand";

type TradingState = {
  selectedTicker: string;
  llmProvider: "openai" | "deepseek";
  setTicker: (ticker: string) => void;
  setProvider: (provider: "openai" | "deepseek") => void;
};

export const useTradingStore = create<TradingState>((set) => ({
  selectedTicker: "AAPL",
  llmProvider: "openai",
  setTicker: (selectedTicker) => set({ selectedTicker }),
  setProvider: (llmProvider) => set({ llmProvider })
}));
