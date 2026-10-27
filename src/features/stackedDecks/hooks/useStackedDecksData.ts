import { useMemo } from "react";
import { useGameContext } from "../../../app/game-context";
import { useLeagueContext } from "../../../app/league-context";
import type { CardTimeBuckets, DropRateCard } from "../../../lib/dropRates";
import {
  EMPTY_CARD_TIME_BUCKETS,
  useLeagueDropRates,
  useLeagueTimeBuckets,
} from "../../../lib/dropRates";

export type StackedDecksRow = DropRateCard & {
  time_buckets?: CardTimeBuckets;
  time_bucket_totals?: CardTimeBuckets;
};

interface UseStackedDecksDataOptions {
  includeTimeBuckets?: boolean;
  verified?: boolean;
}

export function useStackedDecksData({
  includeTimeBuckets = false,
  verified = false,
}: UseStackedDecksDataOptions = {}) {
  const { game } = useGameContext();
  const { selectedLeague, selectedLeagueId, isLoadingLeagues, leaguesError } =
    useLeagueContext();

  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);
  const timeBucketsQuery = useLeagueTimeBuckets(
    game,
    includeTimeBuckets
      ? leagueQuery.data?.context?.time_buckets_url
      : undefined,
    leagueQuery.data?.league.id,
  );

  const rows = useMemo(() => {
    if (!includeTimeBuckets) return leagueQuery.data?.cards;

    return leagueQuery.data?.cards.map((card) => ({
      ...card,
      time_buckets:
        timeBucketsQuery.data?.cards[card.name] ?? EMPTY_CARD_TIME_BUCKETS,
      time_bucket_totals:
        timeBucketsQuery.data?.totals ?? EMPTY_CARD_TIME_BUCKETS,
    }));
  }, [includeTimeBuckets, leagueQuery.data?.cards, timeBucketsQuery.data]);

  const totalCount = useMemo(
    () =>
      leagueQuery.data?.cards.reduce(
        (sum, card) => sum + (verified ? card.verified_count : card.count),
        0,
      ) ?? 0,
    [leagueQuery.data, verified],
  );

  return {
    league: selectedLeague,
    leagueData: leagueQuery.data,
    rows,
    totalCount,
    isLoading:
      isLoadingLeagues || (!!selectedLeagueId && leagueQuery.isLoading),
    error: leaguesError ?? leagueQuery.error,
  };
}
