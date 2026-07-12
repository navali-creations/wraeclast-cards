import type { SortingState } from "@tanstack/react-table";
import type { Card } from "../../types";

export const CARD_NAME_SORT = {
  label: "Name",
  field: "name",
} as const;

export const CARD_SORT_LABELS = [CARD_NAME_SORT.label] as const;

export function searchCards(cards: Card[], normalizedSearch: string): Card[] {
  if (!normalizedSearch) return cards;

  return cards.filter((card) => {
    const haystack = [
      card.name,
      card.flavourText ?? "",
      card.rewardText,
      card.dropLocations.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedSearch);
  });
}

export function sortCards(cards: Card[], sorting: SortingState): Card[] {
  const sortEntry = sorting[0];
  if (!sortEntry) return cards;

  return [...cards].sort((a, b) => {
    const aVal = a[sortEntry.id as keyof Card];
    const bVal = b[sortEntry.id as keyof Card];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortEntry.desc ? -cmp : cmp;
  });
}
