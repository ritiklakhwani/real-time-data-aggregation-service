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
      liquidity_sol: useDexPrice ? (dex.liquidity_sol ?? 0) : (jupiter.liquidity_sol ?? 0),
      stats_5m: {
        transactions:useDexPrice ? dex.stats_5m.transactions : jupiter.stats_5m.transactions ,
        volume: useDexPrice ? dex.stats_5m.volume : jupiter.stats_5m.volume ,
      },
      stats_1hr: {
        transactions:useDexPrice ? dex.stats_1hr.transactions : jupiter.stats_1hr.transactions ,
        volume: useDexPrice ? dex.stats_1hr.volume : jupiter.stats_1hr.volume ,
      },
      stats_6hr: {
        transactions:useDexPrice ? dex.stats_6hr.transactions : jupiter.stats_6hr.transactions ,
        volume: useDexPrice ? dex.stats_6hr.volume : jupiter.stats_6hr.volume ,
      },
      stats_24hr: {
        transactions:useDexPrice ? dex.stats_24hr.transactions : jupiter.stats_24hr.transactions ,
        volume: useDexPrice ? dex.stats_24hr.volume : jupiter.stats_24hr.volume ,
      },
      holders: jupiter.holders ,
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
