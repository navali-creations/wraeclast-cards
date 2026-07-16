import { asPage, asString, asTrueFlag } from "../../lib/searchParams";

const CARDS_BOSS_FILTERS = ["boss", "not-boss"] as const;
export type CardsBossFilter = (typeof CARDS_BOSS_FILTERS)[number];

const CARDS_RARITY_FILTERS = [
  "common",
  "less-common",
  "rare",
  "extremely-rare",
] as const;
export type CardsRarityFilter = (typeof CARDS_RARITY_FILTERS)[number];

export type StackSizeFilter = {
  min?: number;
  max?: number;
};

export const CARD_NAME_SORT = {
  label: "Name",
  field: "name",
} as const;

const CARD_STACK_SIZE_SORT = {
  label: "Stack size",
  field: "stackSize",
} as const;

const CARD_RARITY_SORT = {
  label: "Rarity",
  field: "rarity",
} as const;

export const CARD_SORTS = [
  CARD_NAME_SORT,
  CARD_STACK_SIZE_SORT,
  CARD_RARITY_SORT,
] as const;

export const CARD_SORT_LABELS = CARD_SORTS.map((sort) => sort.label);
type CardSort = (typeof CARD_SORTS)[number];
export type CardSortField = CardSort["field"];

export type CardsSearchParams = {
  name?: string;
  reward?: string;
  stackSize?: string;
  boss?: string;
  rarity?: string;
  sortBy?: CardSortField;
  sortDesc?: true;
  page?: number;
};

function getSearchTokens(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => String(entry).split(","));
  }

  return value === undefined ? [] : String(value).split(",");
}

function isPositiveIntegerToken(value: string): boolean {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0;
}

function asCompactTokenList(
  value: unknown,
  isValid: (value: string) => boolean,
): string | undefined {
  const compactValues = [
    ...new Set(
      getSearchTokens(value)
        .map((entry) => entry.trim().toLowerCase())
        .filter((entry) => entry && isValid(entry)),
    ),
  ];

  return compactValues.length > 0 ? compactValues.join(",") : undefined;
}

function asStackSizeRange(value: unknown): string | undefined {
  const sizes = getSearchTokens(value)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .filter(isPositiveIntegerToken);

  if (sizes.length === 0 || sizes.length > 2) return undefined;
  return sizes.join(",");
}

export function isCardsBossFilter(value: string): value is CardsBossFilter {
  return CARDS_BOSS_FILTERS.includes(value as CardsBossFilter);
}

export function isCardsRarityFilter(value: string): value is CardsRarityFilter {
  return CARDS_RARITY_FILTERS.includes(value as CardsRarityFilter);
}

function isCardSortField(value: string): value is CardSortField {
  return CARD_SORTS.some((sort) => sort.field === value);
}

export function getCardSortByField(field: string | undefined): CardSort {
  return CARD_SORTS.find((sort) => sort.field === field) ?? CARD_NAME_SORT;
}

export function splitSearchList(value: string | undefined): string[] {
  if (!value) return [];

  return [
    ...new Set(
      value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
    ),
  ];
}

export function joinSearchList(values: readonly string[]): string | undefined {
  const compactValues = [
    ...new Set(values.map((value) => value.trim()).filter(Boolean)),
  ];

  return compactValues.length > 0 ? compactValues.join(",") : undefined;
}

export function joinStackSizeSearchList(
  values: readonly string[],
): string | undefined {
  const stackSizes = values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter(isPositiveIntegerToken)
    .slice(0, 2);

  return stackSizes.length > 0 ? stackSizes.join(",") : undefined;
}

export function parseStackSizeFilter(
  value: string | undefined,
): StackSizeFilter | undefined {
  const stackSizes = (value ? value.split(",") : [])
    .map((part) => Number(part.trim()))
    .filter((size) => Number.isInteger(size) && size > 0);

  if (stackSizes.length === 0) return undefined;

  if (stackSizes.length === 1) {
    return { max: stackSizes[0] };
  }

  const [firstSize, secondSize] = stackSizes;

  return {
    min: Math.min(firstSize, secondSize),
    max: Math.max(firstSize, secondSize),
  };
}

export function parseBossFilters(value: string | undefined): CardsBossFilter[] {
  return splitSearchList(value).filter(isCardsBossFilter);
}

export function parseRarityFilters(
  value: string | undefined,
): CardsRarityFilter[] {
  return splitSearchList(value).filter(isCardsRarityFilter);
}

export function validateCardsSearch(
  search: Record<string, unknown>,
): CardsSearchParams {
  const sortBy = asString(search.sortBy)?.trim();

  return {
    name: asString(search.name),
    reward: asCompactTokenList(search.reward, (value) =>
      /^[a-z0-9-]+$/.test(value),
    ),
    stackSize: asStackSizeRange(search.stackSize),
    boss: asCompactTokenList(search.boss, isCardsBossFilter),
    rarity: asCompactTokenList(search.rarity, isCardsRarityFilter),
    sortBy: sortBy && isCardSortField(sortBy) ? sortBy : undefined,
    sortDesc: asTrueFlag(search.sortDesc),
    page: asPage(search.page),
  };
}
