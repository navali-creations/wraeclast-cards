const DIVINATION_CARDS_DATA_CDN =
  "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data";

const DIVINATION_CARDS_IMAGES_BASE_URL = `${DIVINATION_CARDS_DATA_CDN}/images`;

const DIVINATION_CARDS_DATA = {
  dataCdn: DIVINATION_CARDS_DATA_CDN,
  imagesBaseUrl: DIVINATION_CARDS_IMAGES_BASE_URL,
  frameUrl: `${DIVINATION_CARDS_DATA_CDN}/Divination_card_frame.png`,
  separatorUrl: `${DIVINATION_CARDS_DATA_CDN}/Divination_card_separator.png`,
} as const;

export function useDivinationCardsData() {
  return DIVINATION_CARDS_DATA;
}

export {
  DIVINATION_CARDS_DATA,
  DIVINATION_CARDS_DATA_CDN,
  DIVINATION_CARDS_IMAGES_BASE_URL,
};
