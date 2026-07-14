import { CARD_SORT_LABELS } from "../../../cardsSearchParams";
import { useCardsFilteredData } from "./useCardsFilteredData/useCardsFilteredData";
import { useCardsSearchState } from "./useCardsSearchState/useCardsSearchState";

export function useCardsPageControls() {
  const searchState = useCardsSearchState();
  const filteredData = useCardsFilteredData({
    debouncedSearchTerm: searchState.debouncedSearchTerm,
    filterState: searchState.filterState,
    sorting: searchState.sorting,
    stackSizeFilter: searchState.stackSizeFilter,
  });

  return {
    actionsProps: {
      searchTerm: searchState.searchTerm,
      suggestions: filteredData.suggestions,
      filterFacets: filteredData.filterFacets,
      filterValue: searchState.filterValue,
      sortLabels: CARD_SORT_LABELS,
      activeSortLabel: searchState.activeSort.label,
      activeDesc: searchState.activeDesc,
      onSearchChange: searchState.onSearchChange,
      onFilterValueChange: searchState.onFilterValueChange,
      onClearControls: searchState.onClearControls,
      onSortClick: searchState.onSortClick,
    },
    cardCount: filteredData.cardCount,
    filteredCards: filteredData.filteredCards,
    hasError: filteredData.hasError,
    isLoading: filteredData.isLoading,
  };
}
