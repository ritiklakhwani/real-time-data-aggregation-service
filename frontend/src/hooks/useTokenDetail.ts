import { useState, useEffect } from "react";
import { fetchToken } from "../lib/api";
import type { Token } from "../types/token";

export function useTokenDetail(address: string) {
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchToken(address)
      .then((data) => {
        if (cancelled) return;
        setToken(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [address]);

  return { token, loading, error };
}
