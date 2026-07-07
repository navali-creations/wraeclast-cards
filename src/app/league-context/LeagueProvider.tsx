import type { ReactNode } from "react";
import { createContext, useCallback, useMemo, useState } from "react";
import type { DropRateLeague } from "../../lib/dropRates";
import { useGameDropRates } from "../../lib/dropRates";
import { useGameContext } from "../game-context";

export interface LeagueContextValue {
  leagues: DropRateLeague[];
  selectedLeague: DropRateLeague | undefined;
  selectedLeagueId: string | undefined;
  setSelectedLeague: (id: string) => void;
  isLoadingLeagues: boolean;
  leaguesError: Error | null;
}

export const LeagueContext = createContext<LeagueContextValue | null>(null);

const STORAGE_KEY = "leaguesByGame";
const EMPTY_LEAGUES: DropRateLeague[] = [];

function loadLeagues(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function persistLeagues(
  leaguesByGame: Record<string, string>,
): Record<string, string> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaguesByGame));
  return leaguesByGame;
}

function defaultLeagueId(leagues: DropRateLeague[]): string | undefined {
  return (leagues.find((l) => !l.historical) ?? leagues[0])?.id;
}

export function LeagueProvider({ children }: { children: ReactNode }) {
  const { game } = useGameContext();
  const {
    data: gameRates,
    isLoading: isLoadingLeagues,
    error: leaguesError,
  } = useGameDropRates(game);
  const [leaguesByGame, setLeaguesByGame] =
    useState<Record<string, string>>(loadLeagues);

  const leagues = gameRates?.leagues ?? EMPTY_LEAGUES;

  const setSelectedLeague = useCallback(
    (id: string) =>
      setLeaguesByGame((prev) => persistLeagues({ ...prev, [game]: id })),
    [game],
  );

  const selectedLeagueId = leaguesByGame[game] ?? defaultLeagueId(leagues);
  const selectedLeague = leagues.find((l) => l.id === selectedLeagueId);

  const value = useMemo(
    () => ({
      leagues,
      selectedLeague,
      selectedLeagueId,
      setSelectedLeague,
      isLoadingLeagues,
      leaguesError,
    }),
    [
      leagues,
      selectedLeague,
      selectedLeagueId,
      setSelectedLeague,
      isLoadingLeagues,
      leaguesError,
    ],
  );

  return (
    <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>
  );
}
