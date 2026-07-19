import type { DropRateCard, DropRateLeague } from "../../../lib/dropRates";

interface HomepageDropRate {
  cardName: string;
  rate: string;
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

function observedChance(card: DropRateCard) {
  return card.players_saw ?? card.ratio;
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

export function topObservedDropRates(
  cards: DropRateCard[] | undefined,
): HomepageDropRate[] {
  if (!cards) return [];

  return cards
    .filter((card) => card.count > 0)
    .slice()
    .sort((left, right) => observedChance(right) - observedChance(left))
    .slice(0, 5)
    .map((card) => ({
      cardName: card.name,
      rate: PERCENT_FORMATTER.format(observedChance(card)),
    }));
}
