import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ActionIcon } from "../../../../../components/buttons";

type PaginationSummaryProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onChange: (pageNumber: number) => void;
};

export function PaginationSummary({
  page,
  totalPages,
  totalItems,
  pageSize,
  onChange,
}: PaginationSummaryProps) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const progress = Math.round((page / totalPages) * 100);

  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center justify-between gap-3">
        <ActionIcon
          label="Previous page"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <HiChevronLeft className="size-4" />
        </ActionIcon>

        <div className="flex flex-col items-center gap-0.5 select-none leading-none">
          <p className="text-[10px] font-cinzel tracking-[0.2em] uppercase text-(--wc-text-40)">
            Page {page} of {totalPages}
          </p>
          <p className="text-sm font-semibold text-(--wc-text-90)">
            {from}-{to} of {totalItems}
          </p>
        </div>

        <ActionIcon
          label="Next page"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          <HiChevronRight className="size-4" />
        </ActionIcon>
      </div>

      <div
        className="h-px overflow-hidden bg-[color-mix(in_oklch,var(--wc-border)_75%,black)]"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[linear-gradient(90deg,var(--wc-gold-dim),var(--wc-gold-bright))] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
