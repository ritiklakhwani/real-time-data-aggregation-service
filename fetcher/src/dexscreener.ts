import axios from "axios";
import { withRetry } from "./retry.js";

const baseUrl = "https://api.dexscreener.com/latest/dex";

export const fetchFromDexScreener = async () => {
  return withRetry(async () => {
    const response = await axios.get(`${baseUrl}/search?q=solana`);
    return response.data.pairs;
  });
};
