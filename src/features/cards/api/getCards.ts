import type { EGame } from "../../../enums";
import {
  type DivinationCardsDataSource,
  getCardsDataUrl,
  getDivinationCardsDataSource,
} from "../hooks/divinationCardsData";
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

function isRawCard(value: unknown): value is RawCard {
  if (!value || typeof value !== "object") return false;

  const card = value as Record<string, unknown>;

  return (
    typeof card.name === "string" &&
    typeof card.stack_size === "number" &&
    typeof card.description === "string"
  );
}

function parseRawCards(value: unknown): RawCard[] {
  if (!Array.isArray(value) || !value.every(isRawCard)) {
    throw new Error("Invalid divination card data");
  }

  return value;
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

interface GetCardsParams {
  game: EGame;
  leagueName?: string;
}

function toCard(raw: RawCard, source: DivinationCardsDataSource): Card {
  return {
    id: raw.name,
    name: raw.name,
    imageUrl: raw.art_src
      ? `${source.imagesBaseUrl}/${raw.art_src}`
      : undefined,
    frameUrl: source.frameUrl,
    separatorUrl: source.separatorUrl,
    flavourText: raw.flavour_html ? stripHtml(raw.flavour_html) : undefined,
    rewardText: raw.description,
    rewardHtml: raw.reward_html
      ? cleanRewardHtml(raw.reward_html)
      : raw.description,
    stackSize: raw.stack_size,
    dropLocations: [],
  };
}

async function fetchCards(url: string): Promise<RawCard[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch cards: ${res.status}`);
  return parseRawCards(await res.json());
}

export async function getCards({
  game,
  leagueName,
}: GetCardsParams): Promise<Card[]> {
  const source = getDivinationCardsDataSource(game);
  if (!source) return [];

  try {
    const data = await fetchCards(getCardsDataUrl(source, leagueName));
    return data.map((raw) => toCard(raw, source));
  } catch (error) {
    if (!leagueName) throw error;

    const data = await fetchCards(getCardsDataUrl(source, undefined));
    return data.map((raw) => toCard(raw, source));
  }
}
