import cardsJson from "@navali/poe1-divination-cards/data/cards.json";
import { useMemo } from "react";
import { useLeague } from "../../../app/league-context";
import type { DropRateCard } from "../../../lib/useDropRates";
import {
  useGameDropRates,
  useLeagueDropRates,
} from "../../../lib/useDropRates";

type RawCard = { name: string; weight?: number };

const weightByName: Record<string, number> = Object.fromEntries(
  (cardsJson as RawCard[]).map((c) => [c.name, c.weight ?? 0]),
);

export interface StackedDecksRow extends DropRateCard {
  weight: number;
}

export function useStackedDecksData(game: "poe1" | "poe2") {
  const { leagueId } = useLeague();
  const gameQuery = useGameDropRates(game);

  const selectedLeagueId = leagueId ?? gameQuery.data?.leagues[0]?.id;
  const selectedLeague = gameQuery.data?.leagues.find(
    (l) => l.id === selectedLeagueId,
  );

  const leagueQuery = useLeagueDropRates(game, selectedLeagueId);

  const rows = useMemo(
    () =>
      leagueQuery.data?.cards.map((card: DropRateCard) => ({
        ...card,
        weight: weightByName[card.name] ?? 0,
      })),
    [leagueQuery.data],
  );

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
