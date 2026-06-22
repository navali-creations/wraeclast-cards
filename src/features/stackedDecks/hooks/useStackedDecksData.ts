import cardsJson from "@navali/poe1-divination-cards/data/cards.json";
import { useMemo } from "react";
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
  const gameQuery = useGameDropRates(game);
  const latestLeague = gameQuery.data?.leagues[0];

  const leagueQuery = useLeagueDropRates(game, latestLeague?.id);

  const rows = useMemo(
    () =>
      leagueQuery.data?.cards.map((card: DropRateCard) => ({
        ...card,
        weight: weightByName[card.name] ?? 0,
      })),
    [leagueQuery.data],
  );

  return {
    league: latestLeague,
    leagueData: leagueQuery.data,
    rows,
    isLoading: gameQuery.isLoading || (!!latestLeague && leagueQuery.isLoading),
    error: gameQuery.error ?? leagueQuery.error,
  };
}
