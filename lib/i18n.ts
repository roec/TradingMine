export type Locale = "en" | "zh";

const messages = {
  en: {
    appTitle: "TradingMine AI Workstation",
    lang: "Language",
    english: "English",
    chinese: "中文",
    navDashboard: "Dashboard",
    navScreeners: "Screeners",
    navStrategies: "Strategies",
    navBacktests: "Backtests",
    navWatchlist: "Watchlist",
    navSettings: "Settings",
    dashboardMarketOverview: "Market Overview",
    dashboardTopRiskSignals: "Top Risk Signals",
    dashboardStrategySnapshot: "Strategy Snapshot",
    dashboardScreenedOpportunities: "Screened Opportunities",
    dashboardRecentAiInsights: "Recent AI Insights",
    dashboardWatchlistSummary: "Watchlist Summary",
    stockStage: "Stage",
    stockTopExitScore: "TopExitScore",
    stockRisk: "Risk",
    stockScreeningStatus: "Screening Status",
    stockPassTopFilter: "Passes Top Filter",
    stockFailTopFilter: "Fails Top Filter",
    stockAiExplanation: "AI Explanation",
    stockStrategyCompatibility: "Strategy Compatibility"
  },
  zh: {
    appTitle: "TradingMine 智能交易工作台",
    lang: "语言",
    english: "English",
    chinese: "中文",
    navDashboard: "总览",
    navScreeners: "选股器",
    navStrategies: "策略",
    navBacktests: "回测",
    navWatchlist: "自选",
    navSettings: "设置",
    dashboardMarketOverview: "市场概览",
    dashboardTopRiskSignals: "顶部风险信号",
    dashboardStrategySnapshot: "策略快照",
    dashboardScreenedOpportunities: "筛选机会",
    dashboardRecentAiInsights: "AI 洞察",
    dashboardWatchlistSummary: "自选汇总",
    stockStage: "阶段",
    stockTopExitScore: "顶部退出分数",
    stockRisk: "风险",
    stockScreeningStatus: "筛选状态",
    stockPassTopFilter: "通过顶部过滤",
    stockFailTopFilter: "未通过顶部过滤",
    stockAiExplanation: "AI 解读",
    stockStrategyCompatibility: "策略适配性"
  }
} as const;

export type I18nKey = keyof (typeof messages)["en"];

export function resolveLocale(value?: string | null): Locale {
  return value === "zh" ? "zh" : "en";
}

export function t(locale: Locale, key: I18nKey): string {
  return messages[locale][key] ?? messages.en[key];
}
