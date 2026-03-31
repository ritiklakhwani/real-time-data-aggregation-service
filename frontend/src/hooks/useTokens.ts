import { useState, useEffect } from "react";
import { fetchTokens } from "../lib/api";
import type { Token, SortOption, PeriodOption } from "../types/token";

export function useTokens(sort: SortOption, period: PeriodOption) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTokens({ sort, period, page: 1, limit: 1000 })
      .then((data) => {
        if (cancelled) return;
        setTokens(data.tokens);
        setTotal(data.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [sort, period]);

  return { tokens, setTokens, loading, error, total };
}
