import type { Token, SortOption, PeriodOption } from "../types/token";
import { TableHeader } from "./TableHeader";
import { TokenRow } from "./TokenRow";

interface Props {
  tokens: Token[];
  sort: SortOption;
  period: PeriodOption;
  onSort: (s: SortOption) => void;
  pageOffset: number;
  onSelectToken: (address: string) => void;
}

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

function SkeletonRows() {
  return (
    <tbody>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-border skeleton-row" style={{ animationDelay: `${i * 0.08}s` }}>
          <td className="py-[5px] px-2.5"><div className="h-2.5 w-3 rounded bg-surface-raised" /></td>
          <td className="py-[5px] px-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-surface-raised" />
              <div className="h-2.5 w-20 rounded bg-surface-raised" />
            </div>
          </td>
          <td className="py-[5px] px-2.5"><div className="h-2.5 w-14 rounded bg-surface-raised ml-auto" /></td>
          <td className="py-[5px] px-2.5 hidden lg:table-cell"><div className="h-2.5 w-12 rounded bg-surface-raised ml-auto" /></td>
          <td className="py-[5px] px-2.5 hidden lg:table-cell"><div className="h-2.5 w-12 rounded bg-surface-raised ml-auto" /></td>
          <td className="py-[5px] px-2.5 hidden md:table-cell"><div className="h-2.5 w-8 rounded bg-surface-raised ml-auto" /></td>
          <td className="py-[5px] px-2.5"><div className="h-2.5 w-12 rounded bg-surface-raised ml-auto" /></td>
          <td className="py-[5px] px-2.5 hidden xl:table-cell"><div className="h-2.5 w-6 rounded bg-surface-raised ml-auto" /></td>
        </tr>
      ))}
    </tbody>
  );
}

export function TokenTable({ tokens, sort, period, onSort, pageOffset, onSelectToken }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <TableHeader columns={columns} currentSort={sort} onSort={onSort} />
        {tokens.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-text-tertiary text-[12px]">
                No tokens found
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {tokens.map((token, i) => (
              <TokenRow
                key={token.token_address}
                token={token}
                index={pageOffset + i + 1}
                period={period}
                onSelect={onSelectToken}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}

export { SkeletonRows };
