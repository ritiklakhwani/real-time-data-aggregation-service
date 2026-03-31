interface Props {
  page: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, hasMore, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-surface text-text-secondary hover:text-text-primary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors border-none"
      >
        Prev
      </button>
      <span className="text-[11px] text-text-tertiary tabular-nums px-1.5 font-mono">
        {page}/{totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore}
        className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-surface text-text-secondary hover:text-text-primary disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors border-none"
      >
        Next
      </button>
    </div>
  );
}
