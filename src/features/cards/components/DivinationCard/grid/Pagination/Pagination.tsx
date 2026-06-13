import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { Button } from "../../../../../../components/buttons";
import { NavButton } from "./NavButton";
import { PageJump } from "./PageJump";

type PageToken =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: "left" | "right" };

// Max tokens = [first] [ellipsis] [prev] [current] [next] [ellipsis] [last]
const MAX_PAGE_TOKENS = 7;

function buildPageRange(current: number, total: number): PageToken[] {
  if (total <= MAX_PAGE_TOKENS) {
    return Array.from({ length: total }, (_, index) => ({
      type: "page" as const,
      value: index + 1,
    }));
  }

  const range: PageToken[] = [{ type: "page", value: 1 }];
  if (current > 3) range.push({ type: "ellipsis", id: "left" });

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page++)
    range.push({ type: "page", value: page });

  if (current < total - 2) range.push({ type: "ellipsis", id: "right" });
  range.push({ type: "page", value: total });

  return range;
}

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
        <NavButton
          label="Previous page"
          disabled={page === 1}
          onClick={pageActions.previous}
        >
          <HiChevronLeft className="size-4" />
        </NavButton>

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
                variant={token.value === page ? "pageActive" : "page"}
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

        <NavButton
          label="Next page"
          disabled={page === totalPages}
          onClick={pageActions.next}
        >
          <HiChevronRight className="size-4" />
        </NavButton>
      </div>

      <PageJump
        key={page}
        page={page}
        totalPages={totalPages}
        onChange={changePage}
      />
    </div>
  );
}
