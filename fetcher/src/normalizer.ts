import { fetchFromDexScreener } from "../src/dexscreener.js";
import { fetchFromJupiter } from "../src/jupiter.js";

export interface Token {
  token_image: string;
  token_address: string;
  token_name: string;
  token_ticker: string;
  price_sol: number;
  market_cap_sol: number;
  liquidity_sol: number;
  stats_5m: {
    transactions: number;
    volume: number;
  };
  stats_1hr: {
    transactions: number;
    volume: number;
  };
  stats_6hr: {
    transactions: number;
    volume: number;
  };
  stats_24hr: {
    transactions: number;
    volume: number;
  };
  holders?: number | undefined;
  pair_created_at?: string | undefined;
  protocol: string;
  source: string;
}

export const normalizeDexScreenerData = async (
  pairs: any[],
): Promise<Token[]> => {
  const safeStats = (pair: any, timeframe: "m5" | "h1" | "h6" | "h24") => {
    const txns = pair.txns?.[timeframe];
    const volume = pair.volume?.[timeframe];

    return {
      transactions: (txns?.buys ?? 0) + (txns?.sells ?? 0),
      volume: volume ?? 0,
    };
  };

  return pairs
    .filter(
      (pair) =>
        pair.baseToken.symbol.includes("SOL") ||
        pair.quoteToken.symbol.includes("SOL"),
    )
    .map((pair) => ({
      token_image: pair.info?.imageUrl ?? "",
      token_address: pair.baseToken?.address,
      token_name: pair.baseToken?.name ?? "",
      token_ticker: pair.baseToken?.symbol ?? "",

      price_sol: Number(pair.priceNative) || 0,

      market_cap_sol: Number(pair.fdv) || 0,

      liquidity_sol: Number(pair.liquidity?.base) || 0,

      stats_5m: safeStats(pair, "m5"),
      stats_1hr: safeStats(pair, "h1"),
      stats_6hr: safeStats(pair, "h6"),
      stats_24hr: safeStats(pair, "h24"),

      holders: undefined, // Dex usually doesn't provide this
      pair_created_at: pair.pairCreatedAt ?? undefined,

      protocol: pair.dexId ?? "dexscreener",
      source: "dex",
    }));
};

export const normalizeJupiterData = async (tokens: any[]): Promise<Token[]> => {
  const safeStats = (stats: any) => {
    if (!stats) {
      return { transactions: 0, volume: 0 };
    }

    return {
      transactions: (stats.numBuys ?? 0) + (stats.numSells ?? 0),
      volume: (stats.buyVolume ?? 0) + (stats.sellVolume ?? 0),
    };
  };

  return tokens
    .filter((token) => token.symbol.includes("SOL"))
    .map((token) => ({
      token_image: token.icon,
      token_address: token.id,
      token_name: token.name,
      token_ticker: token.symbol,
      price_sol: parseFloat(token.usdPrice) || 0,
      market_cap_sol: token.mcap || 0,
      liquidity_sol: token.liquidity || 0,
      stats_5m: safeStats(token.stats5m),
      stats_1hr: safeStats(token.stats1h),
      stats_6hr: safeStats(token.stats6h),
      stats_24hr: safeStats(token.stats24h),
      holders: token.holderCount || 0,
      pair_created_at: token.firstPool.createdAt || null,
      protocol: "aggregated",
      source: "jupiter",
    }));
};
