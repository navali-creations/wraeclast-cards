import { useEffect, useMemo, useState } from "react";
import type { DivinationCardRarity } from "../../../../lib/divinationCards";
import type { Card } from "../../../cards/types";

const PREVIEW_RARITIES: DivinationCardRarity[] = [4, 3, 2, 1];

function pickPreviewCard(
  cards: readonly Card[],
  rarity: DivinationCardRarity,
  eligibleCardNames: Pick<ReadonlySet<string>, "has">,
  randomValue: number,
) {
  const matchingCards = cards.filter(
    (card) =>
      card.imageUrl &&
      card.rarity === rarity &&
      eligibleCardNames.has(card.name),
  );
  if (matchingCards.length === 0) return undefined;

  const randomIndex = Math.floor(randomValue * matchingCards.length);
  return matchingCards[randomIndex];
}

function selectPreviewCards(
  cards: readonly Card[] | undefined,
  eligibleCardNames: Pick<ReadonlySet<string>, "has">,
  randomValues: readonly number[],
) {
  if (!cards) return [];

  return PREVIEW_RARITIES.map((rarity, index) =>
    pickPreviewCard(cards, rarity, eligibleCardNames, randomValues[index] ?? 0),
  ).filter((card): card is Card => Boolean(card));
}

export function useRarityPreviewCards(
  cards: readonly Card[] | undefined,
  eligibleCardNames: Pick<ReadonlySet<string>, "has">,
): Card[] {
  const [randomValues, setRandomValues] = useState<readonly number[]>([
    0, 0, 0, 0,
  ]);

  useEffect(() => {
    setRandomValues(PREVIEW_RARITIES.map(() => Math.random()));
  }, []);

  return useMemo(
    () => selectPreviewCards(cards, eligibleCardNames, randomValues),
    [cards, eligibleCardNames, randomValues],
  );
}
