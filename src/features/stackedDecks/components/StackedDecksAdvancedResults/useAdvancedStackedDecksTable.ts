import { useStackedDecksTableVariant } from "../../hooks";
import { createAdvancedColumns } from "../StackedDecksResults/columns";

const ADVANCED_RESPONSIVE_COLUMNS = {
  tabletHidden: ["reference_weight"],
  mobileHidden: [
    "reference_weight",
    "community_estimated_weight",
    "community_estimated_weight_delta_vs_reference",
    "count",
  ],
};

export function useAdvancedStackedDecksTable() {
  return useStackedDecksTableVariant({
    defaultSort: "community_estimated_weight_delta_vs_reference",
    sortByKey: "advancedSortBy",
    sortAscKey: "advancedSortAsc",
    createColumns: createAdvancedColumns,
    responsiveColumns: ADVANCED_RESPONSIVE_COLUMNS,
  });
}
