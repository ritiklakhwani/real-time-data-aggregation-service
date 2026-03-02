import express from "express";
import { createClient } from "redis";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

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

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const redis = await createClient()
  .on("error", (err) => console.log("redis error", err))
  .connect();

const getStatsKey = (period: string) => {
  if (period === "5m") return "stats_5m";
  if (period === "1h") return "stats_1hr";
  if (period === "6h") return "stats_6hr";
  return "stats_24hr";
};

// get tokens endpoint
app.get("/tokens", async (req: Request, res: Response) => {
  const raw = await redis.get("tokens:solana:latest");

  if (!raw) {
    return res.status(503).json({ error: "Data not ready yet" });
  }

  const token = JSON.parse(raw);

  const sort = (req.query.sort as string) || "volume";
  const period = (req.query.period as string) || "24h";
  const statsKey = getStatsKey(period);

  token.sort((a: Token, b: Token) => {
    if (sort === "market_cap") return b.market_cap_sol - a.market_cap_sol;
    if (sort === "liquidity") return b.liquidity_sol - a.liquidity_sol;
    if (sort === "transactions")
      return b[statsKey].transactions - a[statsKey].transactions;
    if (sort === "newest")
      return (
        new Date(b.pair_created_at ?? 0).getTime() -
        new Date(a.pair_created_at ?? 0).getTime()
      );
    if (sort === "oldest")
      return (
        new Date(a.pair_created_at ?? 0).getTime() -
        new Date(b.pair_created_at ?? 0).getTime()
      );
    if (sort === "volume") return b[statsKey].volume - a[statsKey].volume;
    return b[statsKey].volume - a[statsKey].volume;
  });

});

// get single token by address
app.get("/tokens/:address", () => {});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
