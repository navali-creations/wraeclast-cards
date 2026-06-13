import cardsData from "@navali/poe1-divination-cards/data/cards.json";
import { DIVINATION_CARDS_IMAGES_BASE_URL } from "../hooks/useDivinationCardsData";
import type { Card } from "../types";

type RawCard = {
  name: string;
  stack_size: number;
  description: string;
  reward_html?: string;
  art_src?: string;
  flavour_html?: string;
  is_disabled?: boolean;
  from_boss?: boolean;
  weight?: number;
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function cleanRewardHtml(html: string): string {
  let result = html
    .replace(/\[\[File:[^\]]*\]\]/g, "")
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1");

  // Unwrap non-tc spans (hoverbox etc.) while keeping their content
  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(
      /<span[^>]*class="(?!tc\s)[^"]*"[^>]*>([\s\S]*?)<\/span>/g,
      "$1",
    );
  }

  return result.trim();
}

function toCard(raw: RawCard, index: number): Card {
  return {
    id: `${index}-${raw.name}`,
    name: raw.name,
    imageUrl: raw.art_src
      ? `${DIVINATION_CARDS_IMAGES_BASE_URL}/${raw.art_src}`
      : undefined,
    flavourText: raw.flavour_html ? stripHtml(raw.flavour_html) : undefined,
    rewardText: raw.description,
    rewardHtml: raw.reward_html
      ? cleanRewardHtml(raw.reward_html)
      : raw.description,
    stackSize: raw.stack_size,
    dropLocations: [],
  };
}

export async function getCards(): Promise<Card[]> {
  return (cardsData as RawCard[]).map(toCard);
}
