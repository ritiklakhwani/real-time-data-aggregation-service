import { useEffect, useState } from "react";
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const periods = [
    { label: "5m", key: "stats_5m" as const },
    { label: "1h", key: "stats_1hr" as const },
    { label: "6h", key: "stats_6hr" as const },
    { label: "24h", key: "stats_24hr" as const },
  ];

  return (
    <div className="h-full rounded-lg border border-border flex flex-col overflow-hidden panel-glass">
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
          <>
            {/* Token header */}
            <div className="px-4 pt-4 pb-3 border-b border-border">
              {/* Row 1: identity + meta */}
              <div className="flex items-center gap-2.5 overflow-hidden">
                <TokenImage src={token.token_image} alt={token.token_ticker} size={24} />
                <span className="text-[14px] font-semibold text-text-primary truncate shrink min-w-0">
                  {token.token_name}
                </span>
                <span className="text-[11px] text-text-tertiary shrink-0">
                  {token.token_ticker}
                </span>
                <div className="flex-1 min-w-2" />
                <span className="text-[10px] font-mono text-text-secondary shrink-0">
                  {truncateAddress(token.token_address)}
                </span>
                <button
                  onClick={copyAddress}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-bg-hover text-text-tertiary hover:text-text-secondary transition-colors duration-100 cursor-pointer bg-transparent border-none shrink-0"
                  title="Copy address"
                >
                  {copied ? (
                    <svg className="w-3 h-3 text-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                <span className="text-[10px] text-text-tertiary bg-surface-raised px-2 py-0.5 rounded">
                  {token.source}
                </span>
              </div>

              {/* Row 2: centered price */}
              <div className="text-center mt-4 mb-1">
                <span className="text-[28px] font-mono font-bold text-text-primary tabular-nums leading-none tracking-tight">
                  ${formatPrice(token.price_sol)}
                </span>
              </div>
            </div>

            {/* Metrics strip */}
            <div className="grid grid-cols-4 border-b border-border">
              <MetricCell label="Mkt Cap" value={`$${formatNumber(token.market_cap_sol)}`} />
              <MetricCell label="Liquidity" value={`$${formatNumber(token.liquidity_sol)}`} border />
              <MetricCell label="Holders" value={token.holders ? formatCompact(token.holders) : "--"} border />
              <MetricCell label="Age" value={timeAgo(token.pair_created_at)} border />
            </div>

            {/* Activity table */}
            <div className="border-b border-border">
              <div className="px-4 py-2">
                <span className="text-[9px] font-medium text-text-tertiary uppercase tracking-[0.08em]">
                  Activity
                </span>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-t border-border">
                    <th className="py-1 px-4 text-[9px] font-medium text-text-tertiary uppercase tracking-wider text-left w-12">Period</th>
                    <th className="py-1 px-3 text-[9px] font-medium text-text-tertiary uppercase tracking-wider text-right">Volume</th>
                    <th className="py-1 px-4 text-[9px] font-medium text-text-tertiary uppercase tracking-wider text-right">Txns</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map(({ label, key }) => {
                    const stats = token[key];
                    return (
                      <tr key={key} className="border-t border-border hover:bg-bg-hover transition-colors duration-100">
                        <td className="py-[5px] px-4 text-[11px] font-medium text-text-primary">{label}</td>
                        <td className="py-[5px] px-3 text-[11px] font-mono font-medium text-text-primary tabular-nums text-right">
                          ${formatNumber(stats.volume)}
                        </td>
                        <td className="py-[5px] px-4 text-[11px] font-mono text-text-secondary tabular-nums text-right">
                          {formatCompact(stats.transactions)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Chart */}
            <div className="border-t border-border">
              <div className="px-4 py-2">
                <span className="text-[9px] font-medium text-text-tertiary uppercase tracking-[0.08em]">
                  Chart
                </span>
              </div>
              <div className="px-3 pb-3">
                <TokenChart address={token.token_address} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricCell({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={`px-3 py-2.5 text-center ${border ? "border-l border-border" : ""}`}>
      <p className="text-[9px] font-medium text-text-tertiary uppercase tracking-[0.04em] mb-0.5 m-0">
        {label}
      </p>
      <p className="text-[12px] font-mono font-semibold text-text-primary tabular-nums leading-tight m-0">
        {value}
      </p>
    </div>
  );
}
