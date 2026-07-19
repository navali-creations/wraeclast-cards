import type { EGame } from "../../../enums";
import {
  type DivinationCardsDataSource,
  divinationCardImageUrl,
  divinationCardRarity,
  divinationCardRewardText,
  divinationCardSlug,
  getDivinationCardsDataSource,
  parseDivinationCards,
  type RawDivinationCard,
} from "../../../lib/divinationCards";
import { resolveDropRatesUrl } from "../../../lib/dropRates";
import { normalizeReference } from "../../../lib/dropRates/normalizers";
import { readJsonResponse } from "../../../lib/readJsonResponse";
import {
  cleanRewardHtml,
  extractRewardTags,
  getRewardSearchText,
  stripHtmlText,
} from "../cards.utils";
import type { Card } from "../types";

interface GetCardsParams {
  game: EGame;
  cardDataUrl?: string;
  allowDefaultSource?: boolean;
}

export async function fetchLegacyCardDataUrl(
  leagueDataUrl: string | undefined,
) {
  if (!leagueDataUrl) return null;

  try {
    const res = await fetch(resolveDropRatesUrl(leagueDataUrl));
    const value = await readJsonResponse(
      res,
      `League drop-rate data from ${leagueDataUrl}`,
    );
    if (!value || typeof value !== "object") return null;

    return (
      normalizeReference((value as { reference?: unknown }).reference)
        ?.source_url ?? null
    );
  } catch {
    return null;
  }
}

function toCard(
  raw: RawDivinationCard,
  source: DivinationCardsDataSource,
): Card {
  const rewardHtml = raw.reward_html
    ? cleanRewardHtml(raw.reward_html)
    : raw.description;

  return {
    id: divinationCardSlug(raw.name),
    name: raw.name,
    imageUrl: divinationCardImageUrl(raw, source.imagesBaseUrl),
    frameUrl: source.frameUrl,
    separatorUrl: source.separatorUrl,
    flavourText: raw.flavour_html ? stripHtmlText(raw.flavour_html) : undefined,
    rewardText: divinationCardRewardText(raw),
    rewardHtml,
    rewardSearchText: getRewardSearchText(rewardHtml),
    rewardTags: extractRewardTags(raw.reward_html),
    stackSize: raw.stack_size,
    dropLocations: [],
    rarity: divinationCardRarity(raw.weight),
    weight: raw.weight,
    fromBoss: raw.from_boss ?? false,
    isDisabled: raw.is_disabled ?? false,
  };
}

async function fetchCards(url: string): Promise<RawDivinationCard[]> {
  const res = await fetch(url);
  return parseDivinationCards(
    await readJsonResponse(res, `Card data from ${url}`),
  );
}

export async function getCards({
  game,
  cardDataUrl,
  allowDefaultSource = true,
}: GetCardsParams): Promise<Card[]> {
  const source = getDivinationCardsDataSource(game, cardDataUrl, {
    allowDefaultSource,
  });
  if (!source) {
    if (cardDataUrl !== undefined) {
      throw new Error("Unsupported divination card data source");
    }

    return [];
  }

  const data = await fetchCards(source.dataUrl);
  return data.map((raw) => toCard(raw, source));
}
