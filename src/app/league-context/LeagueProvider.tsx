import type { ReactNode } from "react";
import { createContext, useCallback, useMemo, useState } from "react";
import { useGame } from "../game-context";

export interface LeagueContextValue {
  leagueId: string | undefined;
  setLeagueId: (id: string) => void;
}

export const LeagueContext = createContext<LeagueContextValue>({
  leagueId: undefined,
  setLeagueId: () => {},
});

const STORAGE_KEY = "leaguesByGame";

function loadLeagues(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function LeagueProvider({ children }: { children: ReactNode }) {
  const { game } = useGame();
  const [leaguesByGame, setLeaguesByGame] =
    useState<Record<string, string>>(loadLeagues);

  const leagueId = leaguesByGame[game];

  const setLeagueId = useCallback(
    (id: string) =>
      setLeaguesByGame((prev) => {
        const next = { ...prev, [game]: id };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }),
    [game],
  );

  const value = useMemo(
    () => ({ leagueId, setLeagueId }),
    [leagueId, setLeagueId],
  );

  return (
    <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>
  );
}
