import { useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createContext, useCallback, useMemo, useState } from "react";
import type { DropRateLeague } from "../../lib/dropRates";
import { useGameDropRates } from "../../lib/dropRates";
import { leagueToSlug, resolveSelectedLeague } from "../../lib/leagueSlug";
import { useClientLayoutEffect } from "../../lib/useClientLayoutEffect/useClientLayoutEffect";
import { useGameContext } from "../game-context";
import { loadLeagueSlugs, persistLeagueSlugs } from "./leagueSlugStorage";

export interface LeagueContextValue {
  leagues: DropRateLeague[];
  selectedLeague: DropRateLeague;
  selectedLeagueId: string;
  setSelectedLeague: (league: DropRateLeague) => void;
  isLoadingLeagues: boolean;
  leaguesError: Error | null;
}

export const LeagueContext = createContext<LeagueContextValue | null>(null);

const EMPTY_LEAGUES: DropRateLeague[] = [];

export function LeagueProvider({ children }: { children: ReactNode }) {
  const { game } = useGameContext();
  const { league: routeLeagueSlug } = useParams({ strict: false });
  const {
    data: gameRates,
    isLoading: isLoadingLeagues,
    error: leaguesError,
  } = useGameDropRates(game);
  const [leagueSlugByGame, setLeagueSlugByGame] = useState<
    Record<string, string>
  >({});

  useClientLayoutEffect(() => {
    setLeagueSlugByGame(loadLeagueSlugs());
  }, []);

  const leagues = gameRates?.leagues ?? EMPTY_LEAGUES;

  const setSelectedLeague = useCallback(
    (league: DropRateLeague) =>
      setLeagueSlugByGame((prev) =>
        persistLeagueSlugs({ ...prev, [game]: leagueToSlug(league) }),
      ),
    [game],
  );

  const selectedSlug = routeLeagueSlug ?? leagueSlugByGame[game];
  const selectedLeague = resolveSelectedLeague(leagues, selectedSlug);
  const selectedLeagueId = selectedLeague.id;

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
