import { useMemo } from "react";
import { useGameContext } from "../../../app/game-context";
import { useLeagueContext } from "../../../app/league-context";
import type { DropRateCard } from "../../../lib/dropRates";
import { useLeagueDropRates } from "../../../lib/dropRates";

export type StackedDecksRow = DropRateCard;

interface UseStackedDecksDataOptions {
  verified?: boolean;
}

export function useStackedDecksData({
  verified = false,
}: UseStackedDecksDataOptions = {}) {
  const { game } = useGameContext();
  const { selectedLeague, selectedLeagueId, isLoadingLeagues, leaguesError } =
    useLeagueContext();

  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);

  const rows = leagueQuery.data?.cards;

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
