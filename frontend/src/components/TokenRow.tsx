import { useRef, useEffect, useState } from "react";
import type { Token, PeriodOption, StatsKey } from "../types/token";
import { periodToStatsKey } from "../types/token";
import { formatPrice, formatNumber, formatCompact, timeAgo } from "../lib/format";
import { TokenImage } from "./TokenImage";
import { RollingPrice } from "./RollingPrice";

interface Props {
  token: Token;
  index: number;
  period: PeriodOption;
  onSelect: (address: string) => void;
}

export function TokenRow({ token, index, period, onSelect }: Props) {
  const prevPrice = useRef(token.price_sol);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (prevPrice.current !== token.price_sol && prevPrice.current !== 0) {
      setDirection(token.price_sol > prevPrice.current ? "up" : "down");
    }
    prevPrice.current = token.price_sol;
  }, [token.price_sol]);

  const statsKey: StatsKey = periodToStatsKey[period];
  const stats = token[statsKey];

  const priceColor =
    direction === "up"
      ? "text-positive"
      : direction === "down"
        ? "text-negative"
        : "text-text-primary";

  return (
    <tr
      className="border-b border-border hover:bg-bg-hover cursor-pointer transition-colors duration-100"
      onClick={() => onSelect(token.token_address)}
    >
      <td className="py-[5px] px-2.5 text-[11px] text-text-tertiary tabular-nums w-7 font-mono">
        {index}
      </td>
      <td className="py-[5px] px-2.5">
        <div className="flex items-center gap-2">
          <TokenImage src={token.token_image} alt={token.token_ticker} size={20} />
          <span className="text-[12px] font-medium text-text-primary truncate max-w-[110px]">
            {token.token_name}
          </span>
          <span className="text-[10px] text-text-tertiary">
            {token.token_ticker}
          </span>
        </div>
      </td>
      <td className="py-[5px] px-2.5 text-right">
        <span className={`text-[12px] font-mono font-semibold tabular-nums transition-colors duration-300 ${priceColor}`}>
          <RollingPrice value={`$${formatPrice(token.price_sol)}`} direction={direction} />
        </span>
      </td>
      <td className="py-[5px] px-2.5 text-right hidden lg:table-cell">
        <span className="text-[11px] font-mono text-text-secondary tabular-nums">
          ${formatNumber(token.market_cap_sol)}
        </span>
      </td>
      <td className="py-[5px] px-2.5 text-right hidden lg:table-cell">
        <span className="text-[11px] font-mono text-text-secondary tabular-nums">
          ${formatNumber(token.liquidity_sol)}
        </span>
      </td>
      <td className="py-[5px] px-2.5 text-right hidden md:table-cell">
        <span className="text-[11px] font-mono text-text-secondary tabular-nums">
          {formatCompact(stats.transactions)}
        </span>
      </td>
      <td className="py-[5px] px-2.5 text-right">
        <span className="text-[12px] font-mono font-medium text-text-primary tabular-nums">
          ${formatNumber(stats.volume)}
        </span>
      </td>
      <td className="py-[5px] px-2.5 text-right hidden xl:table-cell">
        <span className="text-[10px] text-text-tertiary font-mono tabular-nums">
          {timeAgo(token.pair_created_at)}
        </span>
      </td>
    </tr>
  );
}
