import { useContext } from "react";
import type { LeagueContextValue } from "./LeagueProvider";
import { LeagueContext } from "./LeagueProvider";

export function useLeagueContext(): LeagueContextValue {
  const context = useContext(LeagueContext);
  if (!context)
    throw new Error("useLeagueContext must be used within a LeagueProvider");
  return context;
}
