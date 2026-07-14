import type { SortingState } from "@tanstack/react-table";
import { getColorForClass } from "../../../../components/DivinationCard/utils/tc-colors";
import { getRewardTagLabel } from "../../cards.utils";
import {
  type CardsBossFilter,
  type CardsRarityFilter,
  getCardSortByField,
  type StackSizeFilter,
} from "../../cardsSearchParams";
import type {
  FilterOption,
  FilterRange,
} from "../../components/CardsFilters/FilterBar/FilterBar.utils";
import type { Card, CardRarity } from "../../types";

export const CARDS_FILTER_IDS = {
  reward: "reward",
  stackSize: "stackSize",
  boss: "boss",
  rarity: "rarity",
} as const;

type CardsFilterId = (typeof CARDS_FILTER_IDS)[keyof typeof CARDS_FILTER_IDS];

const REWARD_TAG_ORDER = [
  "currency",
  "unique",
  "divination",
  "gem",
  "corrupted",
  "fractured",
  "enchanted",
  "augmented",
  "crafted",
  "rare",
  "magic",
  "normal",
  "white",
  "default",
] as const;

export interface CardsFilterState {
  normalizedSearch: string;
  rewardTags: string[];
  stackSize?: StackSizeFilter;
  bossFilters: CardsBossFilter[];
  rarities: CardsRarityFilter[];
}

const CARD_RARITY_BY_FILTER: Record<CardsRarityFilter, CardRarity> = {
  common: 4,
  "less-common": 3,
  rare: 2,
  "extremely-rare": 1,
};

const CARD_RARITY_OPTIONS: FilterOption[] = [
  { value: "common", label: "Common" },
  { value: "less-common", label: "Less common" },
  { value: "rare", label: "Rare" },
  { value: "extremely-rare", label: "Extremely rare" },
];

function compareRewardTags(a: string, b: string): number {
  const aIndex = REWARD_TAG_ORDER.indexOf(
    a as (typeof REWARD_TAG_ORDER)[number],
  );
  const bIndex = REWARD_TAG_ORDER.indexOf(
    b as (typeof REWARD_TAG_ORDER)[number],
  );

  if (aIndex !== -1 || bIndex !== -1) {
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  }

  return getRewardTagLabel(a).localeCompare(getRewardTagLabel(b));
}

export function getRewardTagOptions(cards: Card[]): FilterOption[] {
  const counts = new Map<string, number>();

  for (const card of cards) {
    for (const tag of card.rewardTags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.keys()].sort(compareRewardTags).map((tag) => ({
    value: tag,
    label: getRewardTagLabel(tag),
    count: counts.get(tag),
    color: getColorForClass(`-${tag}`),
  }));
}

export function getStackSizeRange(
  cards: Card[],
  activeStackSize?: StackSizeFilter,
): FilterRange | undefined {
  const stackSizes = cards.map((card) => card.stackSize);

  if (activeStackSize?.min !== undefined) {
    stackSizes.push(activeStackSize.min);
  } else if (activeStackSize?.max !== undefined) {
    stackSizes.push(1);
  }

  if (activeStackSize?.max !== undefined) {
    stackSizes.push(activeStackSize.max);
  }

  if (stackSizes.length === 0) return undefined;

  const min = Math.min(...stackSizes);
  const max = Math.max(...stackSizes);

  return {
    min,
    max,
    step: 1,
    valueLabel: (value) => `${value.min} to ${value.max} cards`,
  };
}

export function getBossFilterOptions(cards: Card[]): FilterOption[] {
  const bossCount = cards.filter((card) => card.fromBoss).length;
  const notBossCount = cards.length - bossCount;

  return [
    { value: "boss", label: "Boss", count: bossCount },
    { value: "not-boss", label: "Not boss", count: notBossCount },
  ].filter((option) => option.count > 0);
}

export function getRarityFilterOptions(cards: Card[]): FilterOption[] {
  const counts = new Map<CardRarity, number>();

  for (const card of cards) {
    counts.set(card.rarity, (counts.get(card.rarity) ?? 0) + 1);
  }

  return CARD_RARITY_OPTIONS.flatMap((option) => {
    const rarity = CARD_RARITY_BY_FILTER[option.value as CardsRarityFilter];
    const count = counts.get(rarity);
    return count ? [{ ...option, count }] : [];
  });
}

function searchCards(cards: Card[], normalizedSearch: string): Card[] {
  if (!normalizedSearch) return cards;

  return cards.filter((card) => {
    const haystack = [
      card.name,
      card.flavourText ?? "",
      card.rewardText,
      card.rewardSearchText,
      card.rewardTags.map(getRewardTagLabel).join(" "),
      card.dropLocations.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedSearch);
  });
}

function matchesRewardFilter(card: Card, rewardTags: string[]): boolean {
  if (
    rewardTags.length > 0 &&
    !rewardTags.some((tag) => card.rewardTags.includes(tag))
  ) {
    return false;
  }

  return true;
}

function matchesStackSizeFilter(
  card: Card,
  stackSize: StackSizeFilter | undefined,
): boolean {
  if (stackSize?.min !== undefined && card.stackSize < stackSize.min) {
    return false;
  }
  if (stackSize?.max !== undefined && card.stackSize > stackSize.max) {
    return false;
  }

  return true;
}

function matchesBossFilter(
  card: Card,
  bossFilters: CardsBossFilter[],
): boolean {
  if (
    bossFilters.length === 1 &&
    bossFilters.includes("boss") &&
    !card.fromBoss
  ) {
    return false;
  }
  if (
    bossFilters.length === 1 &&
    bossFilters.includes("not-boss") &&
    card.fromBoss
  ) {
    return false;
  }

  return true;
}

function matchesRarityFilter(
  card: Card,
  rarities: CardsRarityFilter[],
): boolean {
  if (
    rarities.length > 0 &&
    !rarities.some((rarity) => card.rarity === CARD_RARITY_BY_FILTER[rarity])
  ) {
    return false;
  }

  return true;
}

export function getFilteredCardSets(
  cards: Card[],
  filterState: CardsFilterState,
) {
  const searchedCards = searchCards(cards, filterState.normalizedSearch);
  const byExcludedFacet: Record<CardsFilterId, Card[]> = {
    [CARDS_FILTER_IDS.reward]: [],
    [CARDS_FILTER_IDS.stackSize]: [],
    [CARDS_FILTER_IDS.boss]: [],
    [CARDS_FILTER_IDS.rarity]: [],
  };
  const all: Card[] = [];

  for (const card of searchedCards) {
    const matchesReward = matchesRewardFilter(card, filterState.rewardTags);
    const matchesStackSize = matchesStackSizeFilter(
      card,
      filterState.stackSize,
    );
    const matchesBoss = matchesBossFilter(card, filterState.bossFilters);
    const matchesRarity = matchesRarityFilter(card, filterState.rarities);

    if (matchesStackSize && matchesBoss && matchesRarity) {
      byExcludedFacet[CARDS_FILTER_IDS.reward].push(card);
    }
    if (matchesReward && matchesBoss && matchesRarity) {
      byExcludedFacet[CARDS_FILTER_IDS.stackSize].push(card);
    }
    if (matchesReward && matchesStackSize && matchesRarity) {
      byExcludedFacet[CARDS_FILTER_IDS.boss].push(card);
    }
    if (matchesReward && matchesStackSize && matchesBoss) {
      byExcludedFacet[CARDS_FILTER_IDS.rarity].push(card);
    }
    if (matchesReward && matchesStackSize && matchesBoss && matchesRarity) {
      all.push(card);
    }
  }

  return {
    all,
    byExcludedFacet,
  };
}

export function sortCards(cards: Card[], sorting: SortingState): Card[] {
  const sortEntry = sorting[0];
  if (!sortEntry) return cards;
  const sort = getCardSortByField(sortEntry.id);

  return [...cards].sort((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortEntry.desc ? -cmp : cmp;
  });
}
