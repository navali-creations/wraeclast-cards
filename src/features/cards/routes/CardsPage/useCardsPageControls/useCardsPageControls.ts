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
    activeDesc: searchState.activeDesc,
    activeSortLabel: searchState.activeSort.label,
    cardCount: filteredData.cardCount,
    filterFacets: filteredData.filterFacets,
    filteredCards: filteredData.filteredCards,
    filterValue: searchState.filterValue,
    hasError: filteredData.hasError,
    isLoading: filteredData.isLoading,
    onClearControls: searchState.onClearControls,
    onFilterValueChange: searchState.onFilterValueChange,
    onSearchChange: searchState.onSearchChange,
    onSortClick: searchState.onSortClick,
    searchTerm: searchState.searchTerm,
    sortLabels: CARD_SORT_LABELS,
    suggestions: filteredData.suggestions,
  };
}
