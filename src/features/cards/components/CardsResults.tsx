import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useCardsQuery } from "../hooks";
import type { Card } from "../types";
import { CardsTable } from "./CardsTable";

interface CardsResultsProps {
  searchTerm: string;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

export function CardsResults({
  searchTerm,
  sorting,
  onSortingChange,
}: CardsResultsProps) {
  const { data, isLoading, error } = useCardsQuery();
  const cards: Card[] = data ?? [];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCards = useMemo(() => {
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
  }, [cards, normalizedSearch]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#6d5b44]">
        {filteredCards.length} cards
      </p>
      <CardsTable
        data={filteredCards}
        isLoading={isLoading}
        error={error}
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
    </div>
  );
}
