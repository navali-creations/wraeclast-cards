import { useMemo } from "react";
import { useLeague } from "../../../app/league-context";
import type { DropRateCard } from "../../../lib/dropRates";
import { useGameDropRates, useLeagueDropRates } from "../../../lib/dropRates";

export type StackedDecksRow = DropRateCard;

export function useStackedDecksData(game: "poe1" | "poe2") {
  const { leagueId } = useLeague();
  const gameQuery = useGameDropRates(game);

  const selectedLeagueId = leagueId ?? gameQuery.data?.leagues[0]?.id;
  const selectedLeague = gameQuery.data?.leagues.find(
    (l) => l.id === selectedLeagueId,
  );

  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);

  const rows = leagueQuery.data?.cards;

  const totalCount = useMemo(
    () => leagueQuery.data?.cards.reduce((sum, c) => sum + c.count, 0) ?? 0,
    [leagueQuery.data],
  );

  return {
    league: selectedLeague,
    leagueData: leagueQuery.data,
    rows,
    totalCount,
    isLoading:
      gameQuery.isLoading || (!!selectedLeagueId && leagueQuery.isLoading),
    error: gameQuery.error ?? leagueQuery.error,
  };
}
