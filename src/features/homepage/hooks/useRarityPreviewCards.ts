import { useMemo } from "react";
import { useCardsQuery } from "../../cards/hooks";
import type { Card, CardRarity } from "../../cards/types";

const PREVIEW_RARITIES: CardRarity[] = [4, 3, 2, 1];

function pickRandomCard(cards: Card[]) {
  return cards[Math.floor(Math.random() * cards.length)];
}

export function useRarityPreviewCards(): Card[] {
  const { data: cards } = useCardsQuery();

  return useMemo(() => {
    if (!cards) return [];

    return PREVIEW_RARITIES.map((rarity) =>
      pickRandomCard(
        cards.filter((card) => card.imageUrl && card.rarity === rarity),
      ),
    ).filter((card): card is Card => Boolean(card));
  }, [cards]);
}
