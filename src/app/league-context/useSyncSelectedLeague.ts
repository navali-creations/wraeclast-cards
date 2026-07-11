import { useEffect } from "react";
import { findLeagueBySlug } from "../../lib/leagueSlug";
import { useLeagueContext } from "./useLeagueContext";

// Keeps league context in sync with the :league URL param as the user
// navigates between game/league-scoped routes.
export function useSyncSelectedLeague(slug: string) {
  const { leagues, selectedLeague, setSelectedLeague } = useLeagueContext();
  const resolved = findLeagueBySlug(leagues, slug);

  useEffect(() => {
    if (resolved && resolved.id !== selectedLeague.id) {
      setSelectedLeague(resolved);
    }
  }, [resolved, selectedLeague, setSelectedLeague]);
}
