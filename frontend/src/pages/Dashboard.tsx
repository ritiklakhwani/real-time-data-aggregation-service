import { useState, useCallback } from "react";
import type { SortOption, PeriodOption, Token } from "../types/token";
import { useTokens } from "../hooks/useTokens";
import { useWebSocket } from "../hooks/useWebSocket";
import { Header } from "../components/Header";
import { TokenTable, SkeletonRows } from "../components/TokenTable";
import { TableHeader } from "../components/TableHeader";
import { PeriodTabs } from "../components/PeriodTabs";
import { SearchBar } from "../components/SearchBar";
import { TokenPanel } from "../components/TokenPanel";

const columns = [
  { label: "#", align: "left" as const },
  { label: "Token", align: "left" as const },
  { label: "Price", sort: "volume" as const, align: "right" as const },
  { label: "Mkt Cap", sort: "market_cap" as const, align: "right" as const, hideBelow: "hidden lg:table-cell" },
  { label: "Liquidity", sort: "liquidity" as const, align: "right" as const, hideBelow: "hidden lg:table-cell" },
  { label: "Txns", sort: "transactions" as const, align: "right" as const, hideBelow: "hidden md:table-cell" },
  { label: "Volume", sort: "volume" as const, align: "right" as const },
  { label: "Age", sort: "newest" as const, align: "right" as const, hideBelow: "hidden xl:table-cell" },
];

const PANEL_WIDTH = 460;

export function Dashboard() {
  const [sort, setSort] = useState<SortOption>("volume");
  const [period, setPeriod] = useState<PeriodOption>("24h");
  const [search, setSearch] = useState("");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  const panelOpen = selectedToken !== null;

  const { tokens, setTokens, loading, error, total } =
    useTokens(sort, period);

  const handleWsUpdate = useCallback(
    (updated: Token[]) => {
      setTokens((prev) => {
        const map = new Map(updated.map((t) => [t.token_address, t]));
        return prev.map((t) => map.get(t.token_address) || t);
      });
    },
    [setTokens]
  );

  const { status } = useWebSocket(handleWsUpdate);

  const handlePeriodChange = (p: PeriodOption) => {
    setPeriod(p);
  };

  const handleSortChange = (s: SortOption) => {
    setSort(s);
  };

  const filtered = search
    ? tokens.filter(
        (t) =>
          t.token_name.toLowerCase().includes(search.toLowerCase()) ||
          t.token_ticker.toLowerCase().includes(search.toLowerCase())
      )
    : tokens;

  return (
    <div className="min-h-screen flex flex-col">
      <Header wsStatus={status} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <main
          className="flex-1 min-w-0 overflow-y-auto transition-all duration-300 ease-out"
          style={{ marginRight: panelOpen ? PANEL_WIDTH + 11 : 0 }}
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <PeriodTabs period={period} onChange={handlePeriodChange} />
                <span className="text-[11px] text-text-primary/60 tabular-nums font-mono">
                  {total} tokens
                </span>
              </div>
              <SearchBar value={search} onChange={setSearch} />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-negative-dim border border-negative/10 text-[12px] text-negative">
                Failed to load. Check that backend services are running.
              </div>
            )}

            {/* Table */}
            <div className="bg-surface-solid rounded-lg border border-border overflow-hidden">
              {loading ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <TableHeader columns={columns} currentSort={sort} onSort={handleSortChange} />
                    <SkeletonRows />
                  </table>
                </div>
              ) : (
                <TokenTable
                  tokens={filtered}
                  sort={sort}
                  period={period}
                  onSort={handleSortChange}
                  pageOffset={0}
                  onSelectToken={setSelectedToken}
                />
              )}
            </div>
          </div>
        </main>

        {/* Side panel */}
        <div
          className="fixed z-30 transition-transform duration-300 ease-out"
          style={{
            width: PANEL_WIDTH,
            top: 60,
            bottom: 16,
            right: 16,
            transform: panelOpen ? "translateX(0)" : `translateX(${PANEL_WIDTH + 32}px)`,
          }}
        >
          {selectedToken && (
            <TokenPanel
              address={selectedToken}
              onClose={() => setSelectedToken(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
