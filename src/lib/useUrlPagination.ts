import type { NavigateOptions } from "@tanstack/react-router";

interface UseUrlPaginationOptions {
  page: number | undefined;
  navigate: (options: NavigateOptions) => void;
}

export function useUrlPagination<TSearch extends { page?: number }>({
  page,
  navigate,
}: UseUrlPaginationOptions) {
  function setPage(next: number) {
    navigate({
      search: (prev) => ({
        ...(prev as TSearch),
        page: next === 1 ? undefined : next,
      }),
      resetScroll: false,
    });
  }

  return { page: page ?? 1, setPage };
}
