import { useNavigate, useSearch } from "@tanstack/react-router";
import type { FileRouteTypes } from "../routeTree.gen";

export function useUrlPagination<TFrom extends FileRouteTypes["fullPaths"]>(
  from: TFrom,
) {
  const search = useSearch({ strict: false });
  const navigate = useNavigate({ from });

  function setPage(next: number) {
    navigate({
      search: (prev: { page?: number }) => ({
        ...prev,
        page: next === 1 ? undefined : next,
      }),
      resetScroll: false,
    } as Parameters<typeof navigate>[0]);
  }

  return { page: search.page ?? 1, setPage };
}
