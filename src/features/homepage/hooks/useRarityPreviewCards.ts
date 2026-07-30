import { useMemo } from "react";
import type { DivinationCardRarity } from "../../../lib/divinationCards";
import { useCardsQuery } from "../../cards/hooks";
import type { Card } from "../../cards/types";

const PREVIEW_RARITIES: DivinationCardRarity[] = [4, 3, 2, 1];

function pickPreviewCard(cards: Card[], rarity: DivinationCardRarity) {
  const matchingCards = cards.filter(
    (card) => card.imageUrl && card.rarity === rarity,
  );
  return matchingCards[rarity % matchingCards.length];
}

export function useRarityPreviewCards(): Card[] {
  const { data: cards } = useCardsQuery();

  return useMemo(() => {
    if (!cards) return [];

    return PREVIEW_RARITIES.map((rarity) =>
      pickPreviewCard(cards, rarity),
    ).filter((card): card is Card => Boolean(card));
  }, [cards]);
}
