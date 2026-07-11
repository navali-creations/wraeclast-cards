import { useStackedDecksTableVariant } from "../../hooks";
import { createColumns } from "./columns";

const BASIC_RESPONSIVE_COLUMNS = {
  tabletHidden: ["research_chance"],
  mobileHidden: ["research_chance", "seen_vs_research", "count"],
};

export function useStackedDecksTable() {
  return useStackedDecksTableVariant({
    defaultSort: "players_saw",
    sortByKey: "sortBy",
    sortAscKey: "sortAsc",
    createColumns,
    responsiveColumns: BASIC_RESPONSIVE_COLUMNS,
  });
}
