import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { getNameSuggestions } from "../../../../../../lib/nameSuggestions";
import type { StackSizeFilter } from "../../../../cardsSearchParams";
import { useCardsQuery } from "../../../../hooks";
import {
  type CardsFilterState,
  getFilteredCardSets,
  sortCards,
} from "../../CardsPage.utils";
import { createCardsFilterFacets } from "../useCardsPageControls.utils";

interface UseCardsFilteredDataParams {
  debouncedSearchTerm: string;
  filterState: CardsFilterState;
  sorting: SortingState;
  stackSizeFilter: StackSizeFilter | undefined;
}

export function useCardsFilteredData({
  debouncedSearchTerm,
  filterState,
  sorting,
  stackSizeFilter,
}: UseCardsFilteredDataParams) {
  const cardsQuery = useCardsQuery();
  const cards = cardsQuery.data ?? [];
  const cardNames = useMemo(() => cards.map((card) => card.name), [cards]);
  const filteredCardSets = useMemo(
    () => getFilteredCardSets(cards, filterState),
    [cards, filterState],
  );
  const filterFacets = useMemo(
    () => createCardsFilterFacets(filteredCardSets, stackSizeFilter),
    [filteredCardSets, stackSizeFilter],
  );
  const suggestions = useMemo(
    () => getNameSuggestions(cardNames, debouncedSearchTerm),
    [cardNames, debouncedSearchTerm],
  );
  const filteredCards = useMemo(
    () => sortCards(filteredCardSets.all, sorting),
    [filteredCardSets.all, sorting],
  );

  return {
    cardCount: cardsQuery.data ? filteredCards.length : undefined,
    filterFacets,
    filteredCards,
    hasError: !!cardsQuery.error,
    isLoading: cardsQuery.isLoading,
    suggestions,
  };
}
