import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ActionIcon } from "../buttons";

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

  const handlePreviousPageClick = () => onChange(page - 1);
  const handleNextPageClick = () => onChange(page + 1);

  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center justify-between gap-3">
        <ActionIcon
          label="Previous page"
          disabled={page === 1}
          onClick={handlePreviousPageClick}
        >
          <HiChevronLeft className="size-4" />
        </ActionIcon>

        <p className="text-sm font-semibold text-(--wc-text-90) select-none leading-none">
          {from}-{to} of {totalItems}
        </p>

        <ActionIcon
          label="Next page"
          disabled={page === totalPages}
          onClick={handleNextPageClick}
        >
          <HiChevronRight className="size-4" />
        </ActionIcon>
      </div>
    </div>
  );
}
