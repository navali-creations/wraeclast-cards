import { useNavigate, useSearch } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";

export interface UrlSortingKeys {
  sortByKey: "sortBy" | "advancedSortBy";
  sortAscKey: "sortAsc" | "advancedSortAsc";
}

export function useUrlSorting(
  defaultColumn: string,
  { sortByKey, sortAscKey }: UrlSortingKeys,
) {
  const search = useSearch({ from: "/$game/$league/stacked-decks" });
  const navigate = useNavigate({ from: "/$game/$league/stacked-decks" });
  const sortBy = search[sortByKey];
  const sortAsc = search[sortAscKey];

  const sorting: SortingState = useMemo(
    () => [{ id: sortBy ?? defaultColumn, desc: !sortAsc }],
    [sortBy, sortAsc, defaultColumn],
  );

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const first = next[0];
    const column = first?.id ?? defaultColumn;
    const desc = first?.desc ?? true;
    navigate({
      search: (prev) => ({
        ...prev,
        [sortByKey]: column === defaultColumn ? undefined : column,
        [sortAscKey]: desc ? undefined : true,
      }),
    });
  };

  return { sorting, onSortingChange };
}
