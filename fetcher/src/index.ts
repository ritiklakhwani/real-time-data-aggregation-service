import cron from "node-cron";
import { fetchFromDexScreener } from "../src/dexscreener.js";
import { fetchFromJupiter } from "../src/jupiter.js";
import {
  normalizeDexScreenerData,
  normalizeJupiterData,
} from "../src/normalizer.js";
import { mergeTokens } from "../src/merger.js";
import { redis } from "../src/redis.js";

async function runFetchCycle() {
  console.log("starting fetch cycle");

  try {
    const [rawDex, rawJupiter] = await Promise.allSettled([
      fetchFromDexScreener(),
      fetchFromJupiter(),
    ]);

    const dexTokens =
      rawDex.status === "fulfilled"
        ? await normalizeDexScreenerData(rawDex.value)
        : [];

    const jupiterTokens =
      rawJupiter.status === "fulfilled"
        ? await normalizeJupiterData(rawJupiter.value)
        : [];

    console.log(`dexScreener: ${dexTokens.length} tokens`);
    console.log(`jupiter: ${jupiterTokens.length} tokens`);

    const mergedTokens = mergeTokens(dexTokens, jupiterTokens);
    console.log(`merged total: ${mergedTokens.length} tokens`);

    await redis.set('tokens:solana:latest', JSON.stringify(mergedTokens), { EX: 60 });

    await redis.publish('token:updates', JSON.stringify(mergedTokens));

    console.log('stored and published', mergedTokens.length, 'tokens');
  } catch (error) {
    console.error("fetch cycle failed:", error);
  }
}

runFetchCycle();

cron.schedule("*/1 * * * * *", runFetchCycle);

console.log("fetcher started");
