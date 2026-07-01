import { useMemo } from "react";
import { useCardsQuery } from "../../cards/hooks";
import type { Card } from "../../cards/types";

export function useRandomCards(count = 4): Card[] {
  const { data: cards } = useCardsQuery();

  return useMemo(() => {
    if (!cards) return [];
    return cards
      .filter((c) => c.imageUrl)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }, [cards, count]);
}
