import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { createSearchUpdater } from "../../../../../../lib/searchNavigation";
import { useDebounce } from "../../../../../../lib/useDebounce";
import { Route } from "../../../../../../routes/$game/$league/cards";
import {
  CARD_NAME_SORT,
  CARD_SORTS,
  type CardsSearchParams,
  getCardSortByField,
  parseBossFilters,
  parseRarityFilters,
  parseStackSizeFilter,
  splitSearchList,
} from "../../../../cardsSearchParams";
import type { FilterValue } from "../../../../components/CardsFilters/FilterBar/FilterBar.utils";
import {
  createCardsFilterSearch,
  createCardsFilterValue,
  createCardsSortSearch,
} from "../useCardsPageControls.utils";

export function useCardsSearchState() {
  const {
    name,
    reward,
    stackSize,
    boss,
    rarity,
    sortBy = CARD_NAME_SORT.field,
    sortDesc,
  } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<CardsSearchParams>(navigate);

  const searchTerm = name ?? "";
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const activeDesc = sortDesc ?? false;
  const rewardTags = useMemo(() => splitSearchList(reward), [reward]);
  const stackSizeFilter = useMemo(
    () => parseStackSizeFilter(stackSize),
    [stackSize],
  );
  const bossFilters = useMemo(() => parseBossFilters(boss), [boss]);
  const rarities = useMemo(() => parseRarityFilters(rarity), [rarity]);
  const filterState = useMemo(
    () => ({
      normalizedSearch: debouncedSearchTerm.trim().toLowerCase(),
      rewardTags,
      stackSize: stackSizeFilter,
      bossFilters,
      rarities,
    }),
    [bossFilters, debouncedSearchTerm, rarities, rewardTags, stackSizeFilter],
  );
  const filterValue = useMemo(
    () =>
      createCardsFilterValue({
        rewardTags,
        stackSizeFilter,
        bossFilters,
        rarities,
      }),
    [bossFilters, rarities, rewardTags, stackSizeFilter],
  );
  const activeSort = useMemo(() => getCardSortByField(sortBy), [sortBy]);
  const sorting = useMemo(
    () => [{ id: activeSort.field, desc: activeDesc }],
    [activeSort.field, activeDesc],
  );

  const setSearchTerm = (value: string) => {
    updateSearch({ name: value || undefined, page: undefined });
  };

  const setFilterValue = (value: FilterValue) => {
    updateSearch(createCardsFilterSearch(value));
  };

  const setSorting = (newSorting: SortingState) => {
    updateSearch(createCardsSortSearch(newSorting[0]));
  };

  const clearControls = () => {
    updateSearch({
      reward: undefined,
      stackSize: undefined,
      boss: undefined,
      rarity: undefined,
      sortBy: undefined,
      sortDesc: undefined,
      page: undefined,
    });
  };

  const handleSortChipClick = (label: string) => {
    const selectedSort =
      CARD_SORTS.find((sort) => sort.label === label) ?? CARD_NAME_SORT;

    setSorting([
      {
        id: selectedSort.field,
        desc: activeSort.field === selectedSort.field ? !activeDesc : false,
      },
    ]);
  };

  return {
    activeDesc,
    activeSort,
    debouncedSearchTerm,
    filterState,
    filterValue,
    searchTerm,
    sorting,
    stackSizeFilter,
    onClearControls: clearControls,
    onFilterValueChange: setFilterValue,
    onSearchChange: setSearchTerm,
    onSortClick: handleSortChipClick,
  };
}
