import { useStackedDecksTableVariant } from "../../hooks";
import { createColumns } from "./columns";

const BASIC_RESPONSIVE_COLUMNS = {
  tabletHidden: ["reference_estimated_chance", "chance_difference"],
  mobileHidden: [
    "reference_estimated_chance",
    "chance_difference",
    "seen_vs_reference",
    "count",
  ],
};

export function useStackedDecksTable() {
  return useStackedDecksTableVariant({
    defaultSort: "ratio",
    sortByKey: "sortBy",
    sortAscKey: "sortAsc",
    createColumns,
    responsiveColumns: BASIC_RESPONSIVE_COLUMNS,
  });
}
