import type { SortingState } from "@tanstack/react-table";
import { createElement } from "react";
import { FiGift, FiStar } from "react-icons/fi";
import { GiCrownedSkull } from "react-icons/gi";
import { PiStack } from "react-icons/pi";
import {
  CARD_NAME_SORT,
  type CardsBossFilter,
  type CardsRarityFilter,
  type CardsSearchParams,
  getCardSortByField,
  isCardsBossFilter,
  isCardsRarityFilter,
  joinSearchList,
  joinStackSizeSearchList,
  type StackSizeFilter,
} from "../../../cardsSearchParams";
import type {
  FilterFacet,
  FilterValue,
} from "../../../components/CardsFilters/FilterBar/FilterBar.utils";
import {
  CARDS_FILTER_IDS,
  getBossFilterOptions,
  type getFilteredCardSets,
  getRarityFilterOptions,
  getRewardTagOptions,
  getStackSizeRange,
} from "../CardsPage.utils";

type FilteredCardSets = ReturnType<typeof getFilteredCardSets>;

interface CardsFilterValueInput {
  rewardTags: string[];
  stackSizeFilter?: StackSizeFilter;
  bossFilters: CardsBossFilter[];
  rarities: CardsRarityFilter[];
}

export function createCardsFilterFacets(
  filteredCardSets: FilteredCardSets,
  stackSizeFilter: StackSizeFilter | undefined,
): FilterFacet[] {
  return [
    {
      id: CARDS_FILTER_IDS.reward,
      label: "Reward",
      icon: createElement(FiGift, { className: "size-4 shrink-0" }),
      maxVisibleOptions: 5,
      options: getRewardTagOptions(
        filteredCardSets.byExcludedFacet[CARDS_FILTER_IDS.reward],
      ),
    },
    {
      id: CARDS_FILTER_IDS.stackSize,
      label: "Stack",
      icon: createElement(PiStack, { className: "size-4 shrink-0" }),
      type: "range",
      options: [],
      range: getStackSizeRange(
        filteredCardSets.byExcludedFacet[CARDS_FILTER_IDS.stackSize],
        stackSizeFilter,
      ),
    },
    {
      id: CARDS_FILTER_IDS.boss,
      label: "Source",
      icon: createElement(GiCrownedSkull, {
        className: "size-4 shrink-0",
      }),
      options: getBossFilterOptions(
        filteredCardSets.byExcludedFacet[CARDS_FILTER_IDS.boss],
      ),
    },
    {
      id: CARDS_FILTER_IDS.rarity,
      label: "Rarity",
      icon: createElement(FiStar, { className: "size-4 shrink-0" }),
      options: getRarityFilterOptions(
        filteredCardSets.byExcludedFacet[CARDS_FILTER_IDS.rarity],
      ),
    },
  ];
}

export function createCardsFilterValue({
  rewardTags,
  stackSizeFilter,
  bossFilters,
  rarities,
}: CardsFilterValueInput): FilterValue {
  return {
    [CARDS_FILTER_IDS.reward]: rewardTags,
    [CARDS_FILTER_IDS.stackSize]: stackSizeFilter
      ? [
          ...(stackSizeFilter.min === undefined
            ? []
            : [String(stackSizeFilter.min)]),
          ...(stackSizeFilter.max === undefined
            ? []
            : [String(stackSizeFilter.max)]),
        ]
      : [],
    [CARDS_FILTER_IDS.boss]: bossFilters,
    [CARDS_FILTER_IDS.rarity]: rarities,
  };
}

export function createCardsFilterSearch(
  value: FilterValue,
): Pick<
  CardsSearchParams,
  "reward" | "stackSize" | "boss" | "rarity" | "page"
> {
  return {
    reward: joinSearchList(value[CARDS_FILTER_IDS.reward] ?? []),
    stackSize: joinStackSizeSearchList(value[CARDS_FILTER_IDS.stackSize] ?? []),
    boss: joinSearchList(
      (value[CARDS_FILTER_IDS.boss] ?? []).filter(isCardsBossFilter),
    ),
    rarity: joinSearchList(
      (value[CARDS_FILTER_IDS.rarity] ?? []).filter(isCardsRarityFilter),
    ),
    page: undefined,
  };
}

export function createCardsSortSearch(
  sortEntry: SortingState[number] | undefined,
): Pick<CardsSearchParams, "sortBy" | "sortDesc" | "page"> {
  const nextSort = sortEntry ? getCardSortByField(sortEntry.id) : undefined;

  return {
    sortBy:
      nextSort && (nextSort.field !== CARD_NAME_SORT.field || sortEntry?.desc)
        ? nextSort.field
        : undefined,
    sortDesc: sortEntry?.desc || undefined,
    page: undefined,
  };
}
