import type { EGame } from "../../../enums";
import {
  getDivinationCardsDataSource,
  parseDivinationCards,
  type RawDivinationCard,
} from "../../../lib/divinationCards";
import { resolveDropRatesUrl } from "../../../lib/dropRates";
import { normalizeReference } from "../../../lib/dropRates/normalizers";
import { readJsonResponse } from "../../../lib/readJsonResponse";
import type { Card } from "../types";
import { createCard } from "./getCards.utils";

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
  return data.map((raw) => createCard(raw, source));
}
