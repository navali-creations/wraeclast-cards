import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useResponsiveColumnVisibility } from "../../../../components/columnVisibilityToggles";
import { useStackedDecksTableCore } from "../../hooks";
import { createColumns } from "./columns";

const BASIC_RESPONSIVE_COLUMNS = {
  tabletHidden: ["research_chance"],
  mobileHidden: ["research_chance", "seen_vs_research", "count"],
};

export function useStackedDecksTable({
  searchTerm,
  verified,
}: {
  searchTerm: string;
  verified: boolean;
}) {
  const { sortBy, sortAsc } = useSearch({ from: "/stacked-decks" });
  const navigate = useNavigate({ from: "/stacked-decks" });

  const sorting: SortingState = useMemo(
    () => [{ id: sortBy ?? "players_saw", desc: !sortAsc }],
    [sortBy, sortAsc],
  );

  const columns = useMemo(() => createColumns(verified), [verified]);

  const [columnVisibility, setColumnVisibility] = useResponsiveColumnVisibility(
    BASIC_RESPONSIVE_COLUMNS,
  );

  return useStackedDecksTableCore({
    searchTerm,
    verified,
    columns,
    sorting,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0];
      const column = first?.id ?? "players_saw";
      const desc = first?.desc ?? true;
      const isDefault = column === "players_saw" && desc;
      navigate({
        search: (prev) => ({
          ...prev,
          sortBy: isDefault ? undefined : column,
          sortAsc: desc ? undefined : true,
        }),
      });
    },
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  });
}
