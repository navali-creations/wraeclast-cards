import { useSearch } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { ResponsiveColumnVisibilityConfig } from "../../../../components/columnVisibilityToggles";
import { useResponsiveColumnVisibility } from "../../../../components/columnVisibilityToggles";
import { useDebounce } from "../../../../lib/useDebounce";
import type { StackedDecksRow } from "../useStackedDecksData";
import type { UrlSortingKeys } from "../useUrlSorting";
import { useUrlSorting } from "../useUrlSorting";
import { useStackedDecksTableCore } from "./useStackedDecksTableCore";

interface StackedDecksTableVariantOptions extends UrlSortingKeys {
  defaultSort: string;
  // biome-ignore lint/suspicious/noExplicitAny: column defs mix per-field value types (string, number, ...), so the array can only be typed against TanStack's own any-based ColumnDef escape hatch
  createColumns: (verified: boolean) => ColumnDef<StackedDecksRow, any>[];
  responsiveColumns: ResponsiveColumnVisibilityConfig;
}

export function useStackedDecksTableVariant({
  defaultSort,
  sortByKey,
  sortAscKey,
  createColumns,
  responsiveColumns,
}: StackedDecksTableVariantOptions) {
  const { search: searchTerm = "", verified = false } = useSearch({
    from: "/$game/stacked-decks",
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { sorting, onSortingChange } = useUrlSorting(defaultSort, {
    sortByKey,
    sortAscKey,
  });

  const columns = useMemo(
    () => createColumns(verified),
    [verified, createColumns],
  );

  const [columnVisibility, setColumnVisibility] =
    useResponsiveColumnVisibility(responsiveColumns);

  return useStackedDecksTableCore({
    searchTerm: debouncedSearchTerm,
    verified,
    columns,
    sorting,
    onSortingChange,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  });
}
