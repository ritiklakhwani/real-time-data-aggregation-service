import { useEffect } from "react";
import { useTokenDetail } from "../hooks/useTokenDetail";
import { TokenImage } from "./TokenImage";
import { TokenChart } from "./TokenChart";
import { formatNumber, formatPrice, formatCompact, truncateAddress, timeAgo } from "../lib/format";

interface Props {
  address: string;
  onClose: () => void;
}

export function TokenPanel({ address, onClose }: Props) {
  const { token, loading, error } = useTokenDetail(address);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const periods = [
    { label: "5m", key: "stats_5m" as const },
    { label: "1h", key: "stats_1hr" as const },
    { label: "6h", key: "stats_6hr" as const },
    { label: "24h", key: "stats_24hr" as const },
  ];

  return (
    <div className="h-full bg-surface-solid rounded-lg border border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.06em]">
          Token Details
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-hover text-text-tertiary hover:text-text-secondary transition-colors duration-100 cursor-pointer bg-transparent border-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block w-4 h-4 border-2 border-border border-t-text-secondary rounded-full animate-spin" />
            <p className="mt-2 text-[11px] text-text-tertiary">Loading...</p>
          </div>
        )}

        {error && !loading && (
          <div className="py-16 text-center">
            <p className="text-[12px] text-text-secondary">
              {error === "404" ? "Token not found" : "Failed to load token"}
            </p>
          </div>
        )}

        {token && !loading && (
          <div className="p-4 space-y-4">
            {/* Token identity + price hero */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <TokenImage src={token.token_image} alt={token.token_ticker} size={28} />
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="text-[14px] font-semibold text-text-primary truncate">
                    {token.token_name}
                  </span>
                  <span className="text-[10px] text-text-tertiary shrink-0">
                    {token.token_ticker}
                  </span>
                </div>
              </div>
              <div className="text-[24px] font-mono font-semibold text-text-primary tabular-nums leading-none">
                ${formatPrice(token.price_sol)}
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-px rounded-lg overflow-hidden border border-border">
              <MetricCell label="Mkt Cap" value={`$${formatNumber(token.market_cap_sol)}`} />
              <MetricCell label="Liquidity" value={`$${formatNumber(token.liquidity_sol)}`} />
              <MetricCell label="Holders" value={token.holders ? formatCompact(token.holders) : "--"} />
              <MetricCell label="Age" value={timeAgo(token.pair_created_at)} />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-text-tertiary font-mono">
              <span
                className="cursor-pointer hover:text-text-secondary transition-colors duration-100"
                onClick={() => navigator.clipboard.writeText(token.token_address)}
                title="Copy address"
              >
                {truncateAddress(token.token_address)}
              </span>
              <span className="opacity-30">|</span>
              <span>{token.protocol}</span>
              <span className="opacity-30">|</span>
              <span>{token.source}</span>
            </div>

            {/* Activity */}
            <div>
              <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.06em] mb-2">
                Activity
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                {periods.map(({ label, key }, i) => {
                  const stats = token[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center px-3 py-[6px] ${
                        i < periods.length - 1 ? "border-b border-border" : ""
                      } hover:bg-bg-hover transition-colors duration-100`}
                    >
                      <span className="text-[11px] font-medium text-text-primary w-8">{label}</span>
                      <div className="flex-1 flex justify-end gap-8">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[9px] text-text-tertiary uppercase">Vol</span>
                          <span className="text-[11px] font-mono font-medium text-text-primary tabular-nums">
                            ${formatNumber(stats.volume)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[9px] text-text-tertiary uppercase">Txns</span>
                          <span className="text-[11px] font-mono text-text-secondary tabular-nums">
                            {formatCompact(stats.transactions)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart */}
            <div>
              <div className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.06em] mb-2">
                Chart
              </div>
              <TokenChart address={token.token_address} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-solid px-2.5 py-2 text-center">
      <p className="text-[9px] font-medium text-text-tertiary uppercase tracking-[0.04em] mb-0.5 m-0">
        {label}
      </p>
      <p className="text-[12px] font-mono font-semibold text-text-primary tabular-nums leading-tight m-0">
        {value}
      </p>
    </div>
  );
}
