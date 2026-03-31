export interface Token {
  token_image: string;
  token_address: string;
  token_name: string;
  token_ticker: string;
  price_sol: number;
  market_cap_sol: number;
  liquidity_sol: number;
  stats_5m: { transactions: number; volume: number };
  stats_1hr: { transactions: number; volume: number };
  stats_6hr: { transactions: number; volume: number };
  stats_24hr: { transactions: number; volume: number };
  holders?: number;
  pair_created_at?: string;
  protocol: string;
  source: string;
}

export interface TokensResponse {
  tokens: Token[];
  page: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export type SortOption =
  | "volume"
  | "market_cap"
  | "liquidity"
  | "transactions"
  | "newest"
  | "oldest";

export type PeriodOption = "5m" | "1h" | "6h" | "24h";

export type StatsKey = "stats_5m" | "stats_1hr" | "stats_6hr" | "stats_24hr";

export const periodToStatsKey: Record<PeriodOption, StatsKey> = {
  "5m": "stats_5m",
  "1h": "stats_1hr",
  "6h": "stats_6hr",
  "24h": "stats_24hr",
};
