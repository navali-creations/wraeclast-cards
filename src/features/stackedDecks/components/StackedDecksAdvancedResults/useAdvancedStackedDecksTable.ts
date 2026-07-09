import { useStackedDecksTableVariant } from "../../hooks";
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
  return useStackedDecksTableVariant({
    defaultSort: "drop_difference",
    sortByKey: "advancedSortBy",
    sortAscKey: "advancedSortAsc",
    createColumns: createAdvancedColumns,
    responsiveColumns: ADVANCED_RESPONSIVE_COLUMNS,
  });
}
