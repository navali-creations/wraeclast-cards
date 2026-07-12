import {
  DIVINATION_CARDS_DATA_CDN,
  DIVINATION_CARDS_IMAGES_BASE_URL,
} from "../hooks/divinationCardsData";
import type { Card, CardRarity } from "../types";

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

function weightToDropRarity(weight: number | undefined): CardRarity {
  if (typeof weight !== "number" || weight <= 0) return 0;
  if (weight > 5000) return 4;
  if (weight > 1000) return 3;
  if (weight > 30) return 2;
  return 1;
}

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
      /<span[^>]*class="(?!tc[\s"])[^"]*"[^>]*>([\s\S]*?)<\/span>/g,
      "$1",
    );
  }

  return result.trim();
}

function toCard(raw: RawCard): Card {
  return {
    id: raw.name,
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
    rarity: weightToDropRarity(raw.weight),
    weight: raw.weight,
    fromBoss: raw.from_boss ?? false,
    isDisabled: raw.is_disabled ?? false,
  };
}

export async function getCards(): Promise<Card[]> {
  const res = await fetch(`${DIVINATION_CARDS_DATA_CDN}/cards.json`);
  if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status}`);
  const data: RawCard[] = await res.json();
  return data.map(toCard);
}
