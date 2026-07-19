import { useMemo } from "react";
import { useGameContext } from "../../../app/game-context";
import { useLeagueContext } from "../../../app/league-context";
import { useLeagueDropRates } from "../../../lib/dropRates";
import type { Card } from "../types";

// This card's row from the same per-league drop-rate dataset the Stacked
// Decks results tables use, plus the league totals their footer shows.
export function useCardStackedDecksRow(card: Card) {
  const { game } = useGameContext();
  const { selectedLeague, selectedLeagueId } = useLeagueContext();
  const {
    data: leagueData,
    isLoading,
    error,
  } = useLeagueDropRates(game, selectedLeagueId);

  const row = leagueData?.cards.find(
    (candidate) => candidate.name === card.name,
  );

  const totalCount = useMemo(
    () => leagueData?.cards.reduce((sum, c) => sum + c.count, 0) ?? 0,
    [leagueData],
  );

  return {
    row,
    league: selectedLeague,
    leagueData,
    totalCount,
    isLoading,
    error,
  };
}
