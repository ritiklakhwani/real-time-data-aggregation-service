import type { Token } from "../src/normalizer.js";
import { normalizeDexScreenerData, normalizeJupiterData } from "../src/normalizer.js";

export function mergeTokens(
  dexTokens: Token[],
  jupiterTokens: Token[],
): Token[] {
  const merged = new Map<string, Token>();

  const jupiterMap = new Map(
    jupiterTokens.map((token) => [token.token_address, token]),
  );

  for (const dex of dexTokens) {
    const jupiter = jupiterMap.get(dex.token_address);

    if (!jupiter) {
      merged.set(dex.token_address, dex);
      continue;
    }

    const useDexPrice = dex.liquidity_sol >= (jupiter.liquidity_sol ?? 0);

    merged.set(dex.token_address, {
      token_image: jupiter.token_image ?? dex.token_image,
      token_address: dex.token_address,
      token_name: jupiter.token_name ?? dex.token_name,
      token_ticker: jupiter.token_ticker ?? dex.token_ticker,
      price_sol: useDexPrice ? dex.price_sol : jupiter.price_sol,
      market_cap_sol: useDexPrice ? dex.market_cap_sol : jupiter.market_cap_sol,
      market_cap_change_24h: useDexPrice
        ? dex.market_cap_change_24h
        : jupiter.market_cap_change_24h,
      liquidity_sol: (dex.liquidity_sol ?? 0) + (jupiter.liquidity_sol ?? 0),
      volume_sol: (dex.volume_sol ?? 0) + (jupiter.volume_sol ?? 0),
      transaction_count:
        (dex.transaction_count ?? 0) + (jupiter.transaction_count ?? 0),
      buys_24h: (dex.buys_24h ?? 0) + (jupiter.buys_24h ?? 0),
      sells_24h: (dex.sells_24h ?? 0) + (jupiter.sells_24h ?? 0),
      price_1hr_change: useDexPrice
        ? dex.price_1hr_change
        : jupiter.price_1hr_change,
      holders: jupiter.holders,
      pair_created_at: jupiter.pair_created_at,
      protocol: dex.protocol,
      source: "merged",
    });
  }

  for (const jupiter of jupiterTokens) {
    if (!merged.has(jupiter.token_address)) {
      merged.set(jupiter.token_address, jupiter);
    }
  }

  return [...merged.values()]
}