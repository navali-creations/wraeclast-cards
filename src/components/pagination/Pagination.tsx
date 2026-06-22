import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { ActionIcon, Button } from "../buttons";
import { buildPageRange } from "./Pagination.utils";

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
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-1">
        <ActionIcon
          label="Previous page"
          disabled={page === 1}
          onClick={pageActions.previous}
        >
          <HiChevronLeft className="size-4" />
        </ActionIcon>

        <div className="flex items-center gap-1 mx-1">
          {buildPageRange(page, totalPages).map((token) =>
            token.type === "ellipsis" ? (
              <span
                key={`ellipsis-${token.id}`}
                className="flex h-9 w-6 items-center justify-center text-(--wc-text-40) select-none"
              >
                …
              </span>
            ) : (
              <Button
                key={token.value}
                variant={token.value === page ? "secondaryActive" : "secondary"}
                aria-label={`Page ${token.value}`}
                aria-current={token.value === page ? "page" : undefined}
                data-page={token.value}
                onClick={pageActions.select}
              >
                {token.value}
              </Button>
            ),
          )}
        </div>

        <ActionIcon
          label="Next page"
          disabled={page === totalPages}
          onClick={pageActions.next}
        >
          <HiChevronRight className="size-4" />
        </ActionIcon>
      </div>
    </div>
  );
}
