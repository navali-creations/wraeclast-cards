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
import { useRarityPreviewCards } from "../../hooks/useRarityPreviewCards/useRarityPreviewCards";

export function useFeaturedCardEntries() {
  const { game } = useGameContext();
  const { selectedLeagueId, isLoadingLeagues, leaguesError } =
    useLeagueContext();
  const cardsQuery = useCardsQuery();
  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);
  const ratesByCardName = useMemo(
    () =>
      new Map(
        featuredObservedDropRates(leagueQuery.data?.cards).map((entry) => [
          entry.cardName,
          entry.rate,
        ]),
      ),
    [leagueQuery.data?.cards],
  );
  const previewCards = useRarityPreviewCards(cardsQuery.data, ratesByCardName);
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

  const entries = useMemo(
    () =>
      previewCards.flatMap((card) => {
        const rate = ratesByCardName.get(card.name);
        if (rate == null) return [];

        return [
          {
            card,
            locations: locationsQuery.data?.cards[card.name] ?? {},
            locationTotals: locationsQuery.data?.totals ?? {},
            locatedCardTotal: locationsQuery.data?.card_totals[card.name] ?? 0,
            rate,
            timeBuckets:
              timeBucketsQuery.data?.cards[card.name] ??
              EMPTY_CARD_TIME_BUCKETS,
            timeBucketTotals:
              timeBucketsQuery.data?.totals ?? EMPTY_CARD_TIME_BUCKETS,
          },
        ];
      }),
    [locationsQuery.data, previewCards, ratesByCardName, timeBucketsQuery.data],
  );

  return {
    entries,
    isLoading:
      cardsQuery.isLoading ||
      isLoadingLeagues ||
      leagueQuery.isLoading ||
      timeBucketsQuery.isLoading ||
      locationsQuery.isLoading,
    error: cardsQuery.error ?? leaguesError ?? leagueQuery.error,
  };
}
