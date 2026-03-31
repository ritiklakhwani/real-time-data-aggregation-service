import { useState, useCallback } from "react";
import type { SortOption, PeriodOption, Token } from "../types/token";
import { useTokens } from "../hooks/useTokens";
import { useWebSocket } from "../hooks/useWebSocket";
import { TokenTable, SkeletonRows } from "../components/TokenTable";
import { TableHeader } from "../components/TableHeader";
import { PeriodTabs } from "../components/PeriodTabs";
import { SearchBar } from "../components/SearchBar";
import { TokenPanel } from "../components/TokenPanel";
import { ConnectionStatus } from "../components/ConnectionStatus";

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

  const filtered = search
    ? tokens.filter((t) => {
        const q = search.toLowerCase();
        return (
          t.token_name.toLowerCase().includes(q) ||
          t.token_ticker.toLowerCase().includes(q) ||
          t.token_address.toLowerCase().includes(q)
        );
      })
    : tokens;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main area */}
      <div
        className="flex-1 flex flex-col min-h-0 transition-all duration-300 ease-out"
        style={{ marginRight: panelOpen ? PANEL_WIDTH + 11 : 0 }}
      >
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 flex flex-col min-h-0 flex-1">
          {/* Controls bar */}
          <div className="py-3 shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Logo + branding */}
              <div className="flex items-center gap-2 shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 397.7 311.7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <linearGradient id="sol-a" x1="360.879" y1="351.455" x2="141.213" y2="-69.294" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 -33)">
                    <stop offset="0" stopColor="#00FFA3"/>
                    <stop offset="1" stopColor="#DC1FFF"/>
                  </linearGradient>
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="url(#sol-a)"/>
                  <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#sol-a)"/>
                  <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#sol-a)"/>
                </svg>
                <span className="text-[12px] font-semibold text-text-primary tracking-[-0.2px] hidden sm:inline">
                  Solana Markets
                </span>
              </div>

              {/* Toggle + token count */}
              <PeriodTabs period={period} onChange={(p) => setPeriod(p)} />
              <span className="text-[11px] text-text-primary/60 tabular-nums font-mono">
                {total} tokens
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Live + Search */}
              <ConnectionStatus status={status} />
              <SearchBar value={search} onChange={setSearch} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-negative-dim border border-negative/10 text-[12px] text-negative shrink-0">
              Failed to load. Check that backend services are running.
            </div>
          )}

          {/* Table card */}
          <div className="panel-glass rounded-lg border border-border flex-1 min-h-0 flex flex-col overflow-hidden mb-4">
            {loading ? (
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full border-collapse min-w-[480px]">
                  <TableHeader columns={columns} currentSort={sort} onSort={(s) => setSort(s)} />
                  <SkeletonRows />
                </table>
              </div>
            ) : (
              <TokenTable
                tokens={filtered}
                sort={sort}
                period={period}
                onSort={(s) => setSort(s)}
                pageOffset={0}
                onSelectToken={setSelectedToken}
              />
            )}
          </div>
        </div>
      </div>

      {/* Side panel */}
      <div
        className="fixed z-30 transition-transform duration-300 ease-out"
        style={{
          width: PANEL_WIDTH,
          top: 12,
          bottom: 12,
          right: 12,
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
  );
}
