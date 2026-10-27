import { useMemo } from "react";
import { useGameContext } from "../../../../app/game-context";
import { useLeagueContext } from "../../../../app/league-context";
import {
  EMPTY_CARD_TIME_BUCKETS,
  useLeagueDropLocations,
  useLeagueDropRates,
  useLeagueTimeBuckets,
} from "../../../../lib/dropRates";
import { useCardsQuery } from "../../../cards/hooks";
import { featuredObservedDropRates } from "../../api/homepageStats";
import { useRarityPreviewCards } from "../../hooks/useRarityPreviewCards";

export function useFeaturedCardEntries() {
  const { game } = useGameContext();
  const { selectedLeagueId, isLoadingLeagues, leaguesError } =
    useLeagueContext();
  const cardsQuery = useCardsQuery();
  const previewCards = useRarityPreviewCards();
  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);
  const timeBucketsQuery = useLeagueTimeBuckets(
    game,
    leagueQuery.data?.context?.time_buckets_url,
    leagueQuery.data?.league.id,
  );
  const locationsQuery = useLeagueDropLocations(
    game,
    leagueQuery.data?.context?.locations_url,
    leagueQuery.data?.league.id,
  );

  const ratesByCardName = useMemo(
    () =>
      new Map(
        featuredObservedDropRates(
          leagueQuery.data?.cards,
          previewCards.map((card) => card.name),
        ).map((entry) => [entry.cardName, entry.rate]),
      ),
    [leagueQuery.data?.cards, previewCards],
  );

  const entries = useMemo(
    () =>
      previewCards.map((card) => ({
        card,
        locations: locationsQuery.data?.cards[card.name] ?? {},
        locationTotals: locationsQuery.data?.totals ?? {},
        locatedCardTotal: locationsQuery.data?.card_totals[card.name] ?? 0,
        rate: ratesByCardName.get(card.name) ?? null,
        timeBuckets:
          timeBucketsQuery.data?.cards[card.name] ?? EMPTY_CARD_TIME_BUCKETS,
        timeBucketTotals:
          timeBucketsQuery.data?.totals ?? EMPTY_CARD_TIME_BUCKETS,
      })),
    [locationsQuery.data, previewCards, ratesByCardName, timeBucketsQuery.data],
  );

  return {
    entries,
    isLoading:
      cardsQuery.isLoading || isLoadingLeagues || leagueQuery.isLoading,
    error: cardsQuery.error ?? leaguesError ?? leagueQuery.error,
  };
}
