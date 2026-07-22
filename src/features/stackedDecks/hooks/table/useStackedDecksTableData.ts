import type { ColumnFiltersState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useStackedDecksData } from "../useStackedDecksData";

interface UseStackedDecksTableDataOptions {
  searchTerm: string;
  verified: boolean;
}

export function useStackedDecksTableData({
  searchTerm,
  verified,
}: UseStackedDecksTableDataOptions) {
  const {
    league,
    leagueData,
    rows: allRows,
    totalCount,
    isLoading,
    error,
  } = useStackedDecksData({ verified });

  const columnFilters: ColumnFiltersState = useMemo(
    () => (searchTerm ? [{ id: "name", value: searchTerm }] : []),
    [searchTerm],
  );

  // getCoreRowModel only recomputes when the `data` reference changes, so a
  // fresh array is needed here to bust its row-value cache whenever the
  // verified toggle flips a column's accessorFn without changing `allRows`.
  // biome-ignore lint/correctness/useExhaustiveDependencies: verified isn't used in the body but must trigger a new array reference
  const data = useMemo(
    () => (allRows ? [...allRows] : allRows),
    [allRows, verified],
  );

  return {
    data,
    columnFilters,
    league,
    leagueData,
    allRows,
    totalCount,
    isLoading,
    error,
  };
}
