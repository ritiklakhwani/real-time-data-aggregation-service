import type { TokensResponse, Token, SortOption, PeriodOption } from "../types/token";

const BASE = "/api";

export async function fetchTokens(params: {
  sort: SortOption;
  period: PeriodOption;
  page: number;
  limit: number;
}): Promise<TokensResponse> {
  const qs = new URLSearchParams({
    sort: params.sort,
    period: params.period,
    page: params.page.toString(),
    limit: params.limit.toString(),
  });
  const res = await fetch(`${BASE}/tokens?${qs}`);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export async function fetchToken(address: string): Promise<Token> {
  const res = await fetch(`${BASE}/tokens/${address}`);
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}
