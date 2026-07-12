import { EGame } from "../../../enums";

const DIVINATION_CARDS_DATA_CDNS: Partial<Record<EGame, string>> = {
  [EGame.Poe1]:
    "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data",
};

export type DivinationCardsDataSource = {
  dataCdn: string;
  imagesBaseUrl: string;
  frameUrl: string;
  separatorUrl: string;
};

export function getDivinationCardsDataSource(
  game: EGame,
): DivinationCardsDataSource | null {
  const dataCdn = DIVINATION_CARDS_DATA_CDNS[game];
  if (!dataCdn) return null;

  return {
    dataCdn,
    imagesBaseUrl: `${dataCdn}/images`,
    frameUrl: `${dataCdn}/Divination_card_frame.png`,
    separatorUrl: `${dataCdn}/Divination_card_separator.png`,
  };
}

export function getCardsDataUrl(
  source: DivinationCardsDataSource,
  leagueName: string | undefined,
) {
  if (!leagueName) return `${source.dataCdn}/cards.json`;

  return `${source.dataCdn}/cards-${encodeURIComponent(leagueName)}.json`;
}
