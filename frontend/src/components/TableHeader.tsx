import type { SortOption } from "../types/token";

interface Column {
  label: string;
  sort?: SortOption;
  align?: "left" | "right";
  hideBelow?: string;
}

interface Props {
  columns: Column[];
  currentSort: SortOption;
  onSort: (s: SortOption) => void;
}

export function TableHeader({ columns, currentSort, onSort }: Props) {
  return (
    <thead>
      <tr className="border-b border-border">
        {columns.map((col) => {
          const active = col.sort && currentSort === col.sort;
          const align = col.align === "right" ? "text-right" : "text-left";
          const hide = col.hideBelow || "";

          return (
            <th
              key={col.label}
              style={{ backgroundColor: "#111114" }}
              className={`py-1.5 px-2.5 text-[10px] font-medium uppercase tracking-[0.06em] whitespace-nowrap sticky top-0 z-10 ${align} ${hide} ${
                col.sort
                  ? "cursor-pointer select-none hover:text-text-secondary"
                  : ""
              } ${active ? "text-text-primary" : "text-text-tertiary"}`}
              onClick={() => col.sort && onSort(col.sort)}
            >
              <span className="inline-flex items-center gap-0.5">
                {col.label}
                {active && (
                  <svg className="w-2.5 h-2.5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                  </svg>
                )}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
