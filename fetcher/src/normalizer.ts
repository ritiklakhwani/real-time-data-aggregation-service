import { fetchFromDexScreener } from "../src/dexscreener.js";
import { fetchFromJupiter } from "../src/jupiter.js";

export interface Token {
  token_image: string;
  token_address: string;
  token_name: string;
  token_ticker: string;
  price_sol: number;
  market_cap_sol: number;
  market_cap_change_24h?: number | undefined;
  liquidity_sol: number;
  volume_sol: number;
  transaction_count: number;
  buys_24h?: number;
  sells_24h?: number;
  price_1hr_change: number;
  holders?: number | undefined;
  pair_created_at?: string | undefined;
  protocol: string;
  source: string;
}

export const normalizeDexScreenerData = async (): Promise<Token[]> => {
  const pairs: any[] = await fetchFromDexScreener();

  return pairs
    .filter(
      (pair) =>
        pair.baseToken.symbol.includes("SOL") ||
        pair.quoteToken.symbol.includes("SOL"),
    )
    .map((pair) => ({
      token_image: pair.info?.imageUrl || "",
      token_address: pair.baseToken.address,
      token_name: pair.baseToken.name,
      token_ticker: pair.baseToken.symbol,
      price_sol: parseFloat(pair.priceUsd) || 0,
      market_cap_sol: pair.marketCap || 0,
      market_cap_change_24h: pair.priceChange?.h24 || 0,
      volume_sol: pair.volume?.h24 || 0,
      liquidity_sol: pair.liquidity?.usd || 0,
      transaction_count: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
      buys_24h: pair.txns?.h24?.buys || 0,
      sells_24h: pair.txns?.h24?.sells || 0,
      price_1hr_change: pair.priceChange?.h1 || 0,
      protocol: pair.dexId || "unknown",
      source: "dexscreener",
    }));
};

export const normalizeJupiterData = async (): Promise<Token[]> => {
  const tokens: any[] = await fetchFromJupiter();

  return tokens
    .filter((token) => token.symbol.includes("SOL"))
    .map((token) => ({
      token_image: token.icon,
      token_address: token.id,
      token_name: token.name,
      token_ticker: token.symbol,
      price_sol: parseFloat(token.usdPrice) || 0, 
      market_cap_sol: token.mcap || 0, 
      market_cap_change_24h: token.stats24h?.priceChange || 0,
      liquidity_sol: token.liquidity || 0, 
      volume_sol: (token.stats24h?.buyVolume || 0 ) + (token.stats24h?.sellVolume || 0), 
      transaction_count: (token.stats24h?.numBuys || 0 ) + (token.stats24h?.numSells || 0), 
      buys_24h: token.stats24h?.numBuys || 0,
      sells_24h: token.stats24h?.numSells || 0,
      price_1hr_change: token.stats1h?.priceChange || 0, 
      holders: token.holderCount || 0,
      pair_created_at: token.firstPool.createdAt || null,
      protocol: "aggregated",
      source: "jupiter",
    }));
};
