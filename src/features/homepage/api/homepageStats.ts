import type { DropRateCard, DropRateLeague } from "../../../lib/dropRates";

interface HomepageDropRate {
  cardName: string;
  rate: string | null;
}

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  notation: "compact",
});

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  style: "percent",
});
const MINIMUM_DISPLAYED_RATE = 0.0001;

function formatHomepageRate(value: number) {
  if (value > 0 && value < MINIMUM_DISPLAYED_RATE) return "<0.01%";

  return PERCENT_FORMATTER.format(value);
}

export function formatHomepageNumber(value: number | undefined) {
  if (value === undefined) return "...";

  return COMPACT_NUMBER_FORMATTER.format(value);
}

export function totalObservedDrops(leagues: DropRateLeague[]) {
  return leagues.reduce(
    (total, league) => total + (league.observed_total ?? 0),
    0,
  );
}

export function featuredObservedDropRates(
  cards: DropRateCard[] | undefined,
  cardNames: readonly string[],
): HomepageDropRate[] {
  const cardsByName = new Map(cards?.map((card) => [card.name, card]));

  return cardNames.map((cardName) => {
    const card = cardsByName.get(cardName);

    return {
      cardName,
      rate: card && card.count > 0 ? formatHomepageRate(card.ratio) : null,
    };
  });
}
