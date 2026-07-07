import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { useResponsiveColumnVisibility } from "../../../../components/columnVisibilityToggles";
import { useDebounce } from "../../../../lib/useDebounce";
import { useStackedDecksTableCore, useUrlSorting } from "../../hooks";
import { createAdvancedColumns } from "../StackedDecksResults/columns";

const ADVANCED_RESPONSIVE_COLUMNS = {
  tabletHidden: ["research_weight"],
  mobileHidden: [
    "research_weight",
    "community_estimated_weight",
    "expected_drops",
    "count",
  ],
};

export function useAdvancedStackedDecksTable() {
  const { search: searchTerm = "", verified = false } = useSearch({
    from: "/stacked-decks",
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { sorting, onSortingChange } = useUrlSorting("drop_difference", {
    sortByKey: "advancedSortBy",
    sortAscKey: "advancedSortAsc",
  });

  const columns = useMemo(() => createAdvancedColumns(verified), [verified]);

  const [columnVisibility, setColumnVisibility] = useResponsiveColumnVisibility(
    ADVANCED_RESPONSIVE_COLUMNS,
  );

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
