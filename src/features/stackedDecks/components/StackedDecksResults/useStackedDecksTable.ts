import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { useResponsiveColumnVisibility } from "../../../../components/columnVisibilityToggles";
import { useDebounce } from "../../../../lib/useDebounce";
import { useStackedDecksTableCore, useUrlSorting } from "../../hooks";
import { createColumns } from "./columns";

const BASIC_RESPONSIVE_COLUMNS = {
  tabletHidden: ["research_chance"],
  mobileHidden: ["research_chance", "seen_vs_research", "count"],
};

export function useStackedDecksTable() {
  const { search: searchTerm = "", verified = false } = useSearch({
    from: "/stacked-decks",
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { sorting, onSortingChange } = useUrlSorting("players_saw", {
    sortByKey: "sortBy",
    sortAscKey: "sortAsc",
  });

  const columns = useMemo(() => createColumns(verified), [verified]);

  const [columnVisibility, setColumnVisibility] = useResponsiveColumnVisibility(
    BASIC_RESPONSIVE_COLUMNS,
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
