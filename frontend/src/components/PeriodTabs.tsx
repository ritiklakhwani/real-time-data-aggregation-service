import { useState } from "react";
import { motion } from "motion/react";
import type { PeriodOption } from "../types/token";

interface Props {
  period: PeriodOption;
  onChange: (p: PeriodOption) => void;
}

const periods: PeriodOption[] = ["5m", "1h", "6h", "24h"];

export function PeriodTabs({ period, onChange }: Props) {
  const [hovered, setHovered] = useState<PeriodOption | null>(null);
  const showHoverRing = hovered && hovered !== period;

  return (
    <div
      className="flex gap-px p-[3px] rounded-lg bg-surface-solid"
      style={{ border: "1px solid rgba(255, 255, 255, 0.06)" }}
      onMouseLeave={() => setHovered(null)}
    >
      {periods.map((p) => {
        const isActive = period === p;

        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            onMouseEnter={() => setHovered(p)}
            className={`relative px-3 py-1 text-[11px] font-medium rounded-md cursor-pointer border-none outline-none bg-transparent z-[1] transition-colors duration-150 ${
              isActive
                ? "text-text-primary"
                : hovered === p
                  ? "text-text-secondary"
                  : "text-text-tertiary"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="period-active"
                className="absolute inset-0 rounded-md bg-surface-raised"
                style={{ zIndex: -1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1,
                }}
              />
            )}
            {showHoverRing && hovered === p && (
              <motion.div
                layoutId="period-hover"
                className="absolute inset-0 rounded-md"
                style={{ zIndex: -1, border: "1px solid rgba(255, 255, 255, 0.06)" }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 1,
                }}
              />
            )}
            {p}
          </button>
        );
      })}
    </div>
  );
}
