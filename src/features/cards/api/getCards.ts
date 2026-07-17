import type { EGame } from "../../../enums";
import { readJsonResponse } from "../../../lib/readJsonResponse";
import {
  cleanRewardHtml,
  extractRewardTags,
  getRewardSearchText,
  stripHtmlText,
} from "../cards.utils";
import {
  type DivinationCardsDataSource,
  getCardsDataUrl,
  getDivinationCardsDataSource,
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

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isOptionalBoolean(value: unknown): value is boolean | undefined {
  return value === undefined || typeof value === "boolean";
}

function isOptionalFiniteNumber(value: unknown): value is number | undefined {
  return (
    value === undefined || (typeof value === "number" && Number.isFinite(value))
  );
}

function isRawCard(value: unknown): value is RawCard {
  if (!value || typeof value !== "object") return false;

  const card = value as Record<string, unknown>;

  return (
    typeof card.name === "string" &&
    typeof card.stack_size === "number" &&
    Number.isFinite(card.stack_size) &&
    typeof card.description === "string" &&
    isOptionalString(card.reward_html) &&
    isOptionalString(card.art_src) &&
    isOptionalString(card.flavour_html) &&
    isOptionalBoolean(card.is_disabled) &&
    isOptionalBoolean(card.from_boss) &&
    isOptionalFiniteNumber(card.weight)
  );
}

function parseRawCards(value: unknown): RawCard[] {
  if (!Array.isArray(value) || !value.every(isRawCard)) {
    throw new Error("Invalid divination card data");
  }

  return value;
}

function weightToDropRarity(weight: number | undefined): CardRarity {
  if (typeof weight !== "number" || weight <= 0) return 0;
  if (weight > 4500) return 4;
  if (weight > 800) return 3;
  if (weight > 150) return 2;
  return 1;
}

interface GetCardsParams {
  game: EGame;
  leagueName?: string;
}

function toCard(raw: RawCard, source: DivinationCardsDataSource): Card {
  const rewardHtml = raw.reward_html
    ? cleanRewardHtml(raw.reward_html)
    : raw.description;

  return {
    id: raw.name,
    name: raw.name,
    imageUrl: raw.art_src
      ? `${source.imagesBaseUrl}/${raw.art_src}`
      : undefined,
    frameUrl: source.frameUrl,
    separatorUrl: source.separatorUrl,
    flavourText: raw.flavour_html ? stripHtmlText(raw.flavour_html) : undefined,
    rewardText: raw.description,
    rewardHtml,
    rewardSearchText: getRewardSearchText(rewardHtml),
    rewardTags: extractRewardTags(raw.reward_html),
    stackSize: raw.stack_size,
    dropLocations: [],
    rarity: weightToDropRarity(raw.weight),
    weight: raw.weight,
    fromBoss: raw.from_boss ?? false,
    isDisabled: raw.is_disabled ?? false,
  };
}

async function fetchCards(url: string): Promise<RawCard[]> {
  const res = await fetch(url);
  return parseRawCards(await readJsonResponse(res, `Card data from ${url}`));
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
