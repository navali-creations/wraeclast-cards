import { EGame } from "../../../enums";

const DIVINATION_CARDS_DATA_CDNS: Partial<Record<EGame, string>> = {
  [EGame.Poe1]:
    "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data",
};

const LATEST_CARDS_DATA_KEY = "latest";
const FATEWEAVER_JSDELIVR_PATH_PREFIX = "/gh/navali-creations/fateweaver@";
const FATEWEAVER_RAW_GITHUB_PATH_PREFIX = "/navali-creations/fateweaver/";
const PACKAGE_JSDELIVR_PATH_PREFIX = "/npm/@navali/poe1-divination-cards@";

export type DivinationCardsDataSource = {
  dataUrl: string;
  imagesBaseUrl: string;
  frameUrl: string;
  separatorUrl: string;
};

function getCardDataBaseUrl(cardDataUrl: string | undefined) {
  if (!cardDataUrl) return null;

  try {
    const url = new URL(cardDataUrl);
    const filename = url.pathname.split("/").at(-1);

    if (!isAllowedCardDataUrl(url)) {
      return null;
    }

    if (!filename || !/^cards(?:-[^/]+)?\.json$/.test(filename)) {
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

function isAllowedCardDataUrl(url: URL) {
  if (url.protocol !== "https:") return false;

  if (url.hostname === "cdn.jsdelivr.net") {
    return (
      url.pathname.startsWith(FATEWEAVER_JSDELIVR_PATH_PREFIX) ||
      url.pathname.startsWith(PACKAGE_JSDELIVR_PATH_PREFIX)
    );
  }

  if (url.hostname === "raw.githubusercontent.com") {
    return url.pathname.startsWith(FATEWEAVER_RAW_GITHUB_PATH_PREFIX);
  }

  return false;
}

export function getDivinationCardsDataSource(
  game: EGame,
  cardDataUrl?: string,
): DivinationCardsDataSource | null {
  const dataCdn = DIVINATION_CARDS_DATA_CDNS[game];
  if (!dataCdn) return null;

  const cardDataBaseUrl = getCardDataBaseUrl(cardDataUrl);
  const dataBaseUrl = cardDataBaseUrl ?? dataCdn;
  const dataUrl =
    cardDataBaseUrl && cardDataUrl ? cardDataUrl : `${dataCdn}/cards.json`;

  return {
    dataUrl,
    imagesBaseUrl: `${dataBaseUrl}/images`,
    frameUrl: `${dataBaseUrl}/Divination_card_frame.png`,
    separatorUrl: `${dataBaseUrl}/Divination_card_separator.png`,
  };
}

export function getDivinationCardsDataKey(game: EGame, cardDataUrl?: string) {
  const source = getDivinationCardsDataSource(game, cardDataUrl);
  return source?.dataUrl ?? LATEST_CARDS_DATA_KEY;
}
