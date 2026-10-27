import { useMemo } from "react";
import type { DivinationCardRarity } from "../../../lib/divinationCards";
import type { Card } from "../../cards/types";

const PREVIEW_RARITIES: DivinationCardRarity[] = [4, 3, 2, 1];

function pickPreviewCard(
  cards: readonly Card[],
  rarity: DivinationCardRarity,
  eligibleCardNames: Pick<ReadonlySet<string>, "has">,
) {
  const matchingCards = cards.filter(
    (card) =>
      card.imageUrl &&
      card.rarity === rarity &&
      eligibleCardNames.has(card.name),
  );
  return matchingCards[rarity % matchingCards.length];
}

export function useRarityPreviewCards(
  cards: readonly Card[] | undefined,
  eligibleCardNames: Pick<ReadonlySet<string>, "has">,
): Card[] {
  return useMemo(() => {
    if (!cards) return [];

    return PREVIEW_RARITIES.map((rarity) =>
      pickPreviewCard(cards, rarity, eligibleCardNames),
    ).filter((card): card is Card => Boolean(card));
  }, [cards, eligibleCardNames]);
}
