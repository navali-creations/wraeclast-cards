import { useNavigate, useSearch } from "@tanstack/react-router";
import type { PaginationState, Updater } from "@tanstack/react-table";

const PAGE_SIZE = 20;

export function useUrlPagination() {
  const { page } = useSearch({ from: "/stacked-decks" });
  const navigate = useNavigate({ from: "/stacked-decks" });

  const pagination: PaginationState = {
    pageIndex: (page ?? 1) - 1,
    pageSize: PAGE_SIZE,
  };

  function onPaginationChange(updater: Updater<PaginationState>) {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    navigate({
      search: (prev) => ({
        ...prev,
        page: next.pageIndex === 0 ? undefined : next.pageIndex + 1,
      }),
      resetScroll: false,
    });
  }

  return { pagination, onPaginationChange };
}
