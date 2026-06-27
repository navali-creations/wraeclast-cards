import { useMemo } from "react";
import { useCardsQuery } from "../../cards/hooks";
import type { Card } from "../../cards/types";

export function useRandomCards(count = 4): Card[] {
  const { data: cards } = useCardsQuery();

  return useMemo(() => {
    if (!cards) return [];
    const shuffled = cards.filter((c) => c.imageUrl);
    for (let idx = shuffled.length - 1; idx > 0; idx--) {
      const swapIdx = Math.floor(Math.random() * (idx + 1));
      [shuffled[idx], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[idx]];
    }
    return shuffled.slice(0, count);
  }, [cards, count]);
}
