import axios from "axios";

const baseUrl = "https://api.dexscreener.com/latest/dex";

export const fetchFromDexScreener = async () => {
  const response = await axios.get(`${baseUrl}/search?q=solana`);
  return response.data.pairs;
};

