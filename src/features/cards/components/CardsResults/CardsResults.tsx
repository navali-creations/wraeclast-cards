import { useQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useCardsQuery } from "../../hooks";
import type { Card } from "../../types";
import { CardsGrid } from "../CardsGrid/CardsGrid";

interface CardsResultsProps {
  searchTerm: string;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

function searchCards(cards: Card[], normalizedSearch: string): Card[] {
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

export function CardsResults({ searchTerm, sorting }: CardsResultsProps) {
  const { data } = useCardsQuery();
  const cards: Card[] = data ?? [];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const { data: matchedCards = cards } = useQuery({
    queryKey: ["cards", "search", normalizedSearch],
    queryFn: () => searchCards(cards, normalizedSearch),
    enabled: !!data,
  });

  const filteredCards = useMemo(() => {
    const sortEntry = sorting[0];
    if (!sortEntry) return matchedCards;

    return [...matchedCards].sort((a, b) => {
      const aVal = a[sortEntry.id as keyof Card];
      const bVal = b[sortEntry.id as keyof Card];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortEntry.desc ? -cmp : cmp;
    });
  }, [matchedCards, sorting]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#6d5b44]">
        {filteredCards.length} cards
      </p>
      <CardsGrid data={filteredCards} />
    </div>
  );
}
