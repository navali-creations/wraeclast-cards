import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Button } from "../buttons";
import { buildPageRange } from "./Pagination.utils";

const paginationIconClassName =
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:text-(--wc-text-30) disabled:hover:text-(--wc-text-60)";
const paginationPageClassName =
  "relative hover:text-(--wc-hero-accent) active:text-(--wc-gold-bright) after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-(--wc-hero-accent) after:transition-transform after:duration-150 hover:after:scale-x-100";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (pageNumber: number) => void;
}) {
  if (totalPages <= 1) return null;

  function changePage(pageNumber: number) {
    onChange(pageNumber);
  }

  const pageActions = {
    previous: () => changePage(page - 1),
    next: () => changePage(page + 1),
    select: (event: React.MouseEvent<HTMLButtonElement>) => {
      const pageNumber = Number(event.currentTarget.dataset.page);
      if (Number.isNaN(pageNumber)) return;
      changePage(pageNumber);
    },
  };

  return (
    <nav
      aria-label="Cards pagination"
      className="flex flex-col items-center gap-2"
    >
      <div className="inline-flex items-center gap-1">
        <Button
          variant="pagination"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={pageActions.previous}
          className={paginationIconClassName}
        >
          <HiChevronLeft className="size-4" />
        </Button>

        <span
          aria-current="page"
          className="wc-text-glow-hero relative flex h-8 min-w-14 items-center justify-center rounded-sm px-2 text-sm font-bold text-(--wc-hero-accent) after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-(--wc-hero-accent) sm:hidden"
        >
          {page} / {totalPages}
        </span>

        <div className="mx-1 hidden items-center gap-1 sm:flex">
          {buildPageRange(page, totalPages).map((token) =>
            token.type === "ellipsis" ? (
              <span
                key={`ellipsis-${token.id}`}
                className="flex h-9 w-6 items-center justify-center text-(--wc-text-40) select-none"
              >
                ...
              </span>
            ) : (
              <Button
                key={token.value}
                variant={
                  token.value === page ? "paginationActive" : "pagination"
                }
                aria-label={`Page ${token.value}`}
                aria-current={token.value === page ? "page" : undefined}
                data-page={token.value}
                onClick={pageActions.select}
                className={
                  token.value === page ? undefined : paginationPageClassName
                }
              >
                {token.value}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="pagination"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={pageActions.next}
          className={paginationIconClassName}
        >
          <HiChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
