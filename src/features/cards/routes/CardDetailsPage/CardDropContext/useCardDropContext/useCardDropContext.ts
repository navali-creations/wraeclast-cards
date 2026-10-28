import { useMemo } from "react";
import { useGameContext } from "../../../../../../app/game-context";
import { useLeagueContext } from "../../../../../../app/league-context";
import {
  EMPTY_CARD_TIME_BUCKETS,
  useLeagueDropLocations,
  useLeagueDropRates,
  useLeagueTimeBuckets,
} from "../../../../../../lib/dropRates";
import { buildNormalizedLocationData } from "../../../../../stackedDecks/components/DropContextCharts/dropContext.utils";

export function useCardDropContext(cardName: string) {
  const { game } = useGameContext();
  const { selectedLeagueId } = useLeagueContext();
  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);
  const context = leagueQuery.data?.context;
  const timeQuery = useLeagueTimeBuckets(
    game,
    context?.time_buckets_url,
    leagueQuery.data?.league.id,
  );
  const locationsQuery = useLeagueDropLocations(
    game,
    context?.locations_url,
    leagueQuery.data?.league.id,
  );

  const data = useMemo(() => {
    const locations = locationsQuery.data?.cards[cardName] ?? {};
    const locationTotals = locationsQuery.data?.totals ?? {};
    const locatedCardTotal = locationsQuery.data?.card_totals[cardName] ?? 0;

    return {
      timeBuckets: timeQuery.data?.cards[cardName] ?? EMPTY_CARD_TIME_BUCKETS,
      timeBucketTotals: timeQuery.data?.totals ?? EMPTY_CARD_TIME_BUCKETS,
      locationRows: buildNormalizedLocationData(
        locations,
        locationTotals,
        locatedCardTotal,
      ),
    };
  }, [cardName, locationsQuery.data, timeQuery.data]);

  return {
    ...data,
    timeStatus: {
      isLoading:
        leagueQuery.isLoading ||
        (!!context?.time_buckets_url && timeQuery.isLoading),
      error: leagueQuery.error ?? timeQuery.error,
    },
    locationStatus: {
      isLoading:
        leagueQuery.isLoading ||
        (!!context?.locations_url && locationsQuery.isLoading),
      error: leagueQuery.error ?? locationsQuery.error,
    },
  };
}
