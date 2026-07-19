import { EGame, type EGame as Game } from "../enums.ts";
import { POE1_DIVINATION_CARDS_VERSION } from "./divinationCardsVersion.generated.ts";

export type DivinationCardRarity = 0 | 1 | 2 | 3 | 4;

export interface RawDivinationCard {
  name: string;
  stack_size: number;
  description: string;
  reward_html?: string;
  art_src?: string;
  flavour_html?: string;
  is_disabled?: boolean;
  from_boss?: boolean;
  weight?: number;
}

export interface DivinationCardsDataSource {
  dataUrl: string;
  imagesBaseUrl: string;
  frameUrl: string;
  separatorUrl: string;
}

interface DivinationCardsDataSourceOptions {
  allowDefaultSource?: boolean;
}

const DIVINATION_CARDS_DATA_CDNS: Partial<Record<Game, string>> = {
  [EGame.Poe1]: `https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@${POE1_DIVINATION_CARDS_VERSION}/data`,
};
const LATEST_CARDS_DATA_KEY = "latest";
const FATEWEAVER_JSDELIVR_PATH_PREFIX = "/gh/navali-creations/fateweaver@";
const FATEWEAVER_RAW_GITHUB_PATH_PREFIX = "/navali-creations/fateweaver/";
const PACKAGE_JSDELIVR_PATH_PREFIX = "/npm/@navali/poe1-divination-cards@";

export const DIVINATION_CARD_RARITY_LABELS: Record<
  DivinationCardRarity,
  string
> = {
  0: "Unknown",
  1: "Extremely rare",
  2: "Rare",
  3: "Less common",
  4: "Common",
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isRawDivinationCard(value: unknown): value is RawDivinationCard {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    typeof value.stack_size === "number" &&
    Number.isFinite(value.stack_size) &&
    typeof value.description === "string" &&
    isOptionalString(value.reward_html) &&
    isOptionalString(value.art_src) &&
    isOptionalString(value.flavour_html) &&
    isOptionalBoolean(value.is_disabled) &&
    isOptionalBoolean(value.from_boss) &&
    isOptionalFiniteNumber(value.weight)
  );
}

export function parseDivinationCards(value: unknown): RawDivinationCard[] {
  if (!Array.isArray(value) || !value.every(isRawDivinationCard)) {
    throw new Error("Invalid divination card data");
  }

  createDivinationCardRouteIndex(value);

  return value;
}

export function divinationCardSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createDivinationCardRouteIndex<T extends { name: string }>(
  cards: readonly T[],
): Map<string, T> {
  const cardsByRouteId = new Map<string, T>();

  for (const card of cards) {
    const routeId = divinationCardSlug(card.name);
    if (!routeId || cardsByRouteId.has(routeId)) {
      throw new Error(`Invalid or duplicate card route id for ${card.name}`);
    }
    cardsByRouteId.set(routeId, card);
  }

  return cardsByRouteId;
}

export function divinationCardRarity(
  weight: number | undefined,
): DivinationCardRarity {
  if (typeof weight !== "number" || weight <= 0) return 0;
  if (weight > 5000) return 4;
  if (weight > 1000) return 3;
  if (weight > 30) return 2;
  return 1;
}

export function divinationCardRarityLabel(weight: number | undefined): string {
  return DIVINATION_CARD_RARITY_LABELS[divinationCardRarity(weight)];
}

export function normalizeDivinationCardWikiMarkup(
  value: string,
  fileReplacement: string,
): string {
  return value
    .replace(/\[\[File:[^\]]*\]\]/gi, fileReplacement)
    .replace(/\[\[[^\]|]*\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1");
}

export function divinationCardMarkupToText(value: string): string {
  return normalizeDivinationCardWikiMarkup(value, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function divinationCardRewardText(card: RawDivinationCard): string {
  return divinationCardMarkupToText(card.reward_html ?? card.description);
}

export function divinationCardImageUrl(
  card: RawDivinationCard,
  imagesBaseUrl: string,
): string | undefined {
  return card.art_src
    ? `${imagesBaseUrl}/${encodeURIComponent(card.art_src)}`
    : undefined;
}

function isAllowedCardDataUrl(url: URL): boolean {
  if (url.protocol !== "https:") return false;

  if (url.hostname === "cdn.jsdelivr.net") {
    return (
      url.pathname.startsWith(FATEWEAVER_JSDELIVR_PATH_PREFIX) ||
      url.pathname.startsWith(PACKAGE_JSDELIVR_PATH_PREFIX)
    );
  }

  return (
    url.hostname === "raw.githubusercontent.com" &&
    url.pathname.startsWith(FATEWEAVER_RAW_GITHUB_PATH_PREFIX)
  );
}

function getCardDataBaseUrl(cardDataUrl: string): string | null {
  try {
    const url = new URL(cardDataUrl);
    const filename = url.pathname.split("/").at(-1);

    if (
      !isAllowedCardDataUrl(url) ||
      !filename ||
      !/^cards(?:-[^/]+)?\.json$/.test(filename)
    ) {
      return null;
    }

    url.pathname = url.pathname.replace(/\/[^/]+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getDivinationCardsDataSource(
  game: Game,
  cardDataUrl?: string,
  { allowDefaultSource = true }: DivinationCardsDataSourceOptions = {},
): DivinationCardsDataSource | null {
  const dataCdn = DIVINATION_CARDS_DATA_CDNS[game];
  if (!dataCdn) return null;

  if (cardDataUrl !== undefined) {
    const cardDataBaseUrl = getCardDataBaseUrl(cardDataUrl);
    if (!cardDataBaseUrl) return null;

    return {
      dataUrl: cardDataUrl,
      imagesBaseUrl: `${cardDataBaseUrl}/images`,
      frameUrl: `${cardDataBaseUrl}/Divination_card_frame.png`,
      separatorUrl: `${cardDataBaseUrl}/Divination_card_separator.png`,
    };
  }

  if (!allowDefaultSource) return null;

  return {
    dataUrl: `${dataCdn}/cards.json`,
    imagesBaseUrl: `${dataCdn}/images`,
    frameUrl: `${dataCdn}/Divination_card_frame.png`,
    separatorUrl: `${dataCdn}/Divination_card_separator.png`,
  };
}

export function getDivinationCardsDataKey(
  game: Game,
  cardDataUrl?: string,
  options?: DivinationCardsDataSourceOptions,
): string {
  const source = getDivinationCardsDataSource(game, cardDataUrl, options);
  if (source) return source.dataUrl;
  if (cardDataUrl !== undefined) return `invalid:${cardDataUrl}`;
  return options?.allowDefaultSource === false
    ? "unavailable"
    : LATEST_CARDS_DATA_KEY;
}
