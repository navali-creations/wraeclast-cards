import { useMemo } from "react";
import { useCardsQuery } from "../../cards/hooks";
import type { Card } from "../../cards/types";

export function useRandomCards(count = 4): Card[] {
  const { data: cards } = useCardsQuery();

  return useMemo(() => {
    if (!cards) return [];
    return cards
      .filter((card) => card.imageUrl)
      .map((card) => ({ card, sortKey: Math.random() }))
      .sort((left, right) => left.sortKey - right.sortKey)
      .map(({ card }) => card)
      .slice(0, count);
  }, [cards, count]);
}
