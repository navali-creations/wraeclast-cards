import type { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useResponsiveColumnVisibility } from "../../../../components/columnVisibilityToggles";
import { useStackedDecksTableCore } from "../../hooks";
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

export function useAdvancedStackedDecksTable({
  searchTerm,
  verified,
}: {
  searchTerm: string;
  verified: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "drop_difference", desc: true },
  ]);

  const columns = useMemo(() => createAdvancedColumns(verified), [verified]);

  const [columnVisibility, setColumnVisibility] = useResponsiveColumnVisibility(
    ADVANCED_RESPONSIVE_COLUMNS,
  );

  return useStackedDecksTableCore({
    searchTerm,
    verified,
    columns,
    sorting,
    onSortingChange: setSorting,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
  });
}
