import type { Card } from "../types";

type CardApiItem = {
  id: string;
  name: string;
  imageUrl?: string;
  flavourText?: string;
  rewardText: string;
  stackSize: number;
  dropLocations?: string[];
};

// `/card.json` will be replaced by the cards ID; for now it's just to have a look on table UI
const CARDS_JSON_URL = "/cards.json";

function toCard(item: CardApiItem): Card {
  return {
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    flavourText: item.flavourText,
    rewardText: item.rewardText,
    stackSize: item.stackSize,
    dropLocations: item.dropLocations ?? [],
  };
}

export async function getCards(): Promise<Card[]> {
  const res = await fetch(CARDS_JSON_URL);
  if (!res.ok) {
    throw new Error("Failed to load cards");
  }

  const payload = (await res.json()) as unknown;
  if (!Array.isArray(payload)) {
    throw new Error("Invalid cards payload");
  }

  return payload.map((item) => toCard(item as CardApiItem));
}
