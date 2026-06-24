import { useContext } from "react";
import type { LeagueContextValue } from "./LeagueProvider";
import { LeagueContext } from "./LeagueProvider";

export function useLeague(): LeagueContextValue {
  const context = useContext(LeagueContext);
  if (!context)
    throw new Error("useLeague must be used within a LeagueProvider");
  return context;
}
