import type { QueryClient } from "@tanstack/react-query";
import type { EGame } from "../../enums";
import { gameDropRatesQueryOptions } from "../../lib/dropRates";
import { leagueToSlug, resolveSelectedLeague } from "../../lib/leagueSlug";
import { loadLeagueSlugs } from "./leagueSlugStorage";

// Resolves which league a game/league-scoped route should redirect to when
// no league is specified, or when the URL's league slug doesn't match any
// current league (rotated league, typo, stale bookmark): the last league the
// user picked for this game, falling back to the current non-historical league
// (or the "standard" placeholder for a game with no published leagues yet).
export async function resolveDefaultLeagueSlug(
  queryClient: QueryClient,
  game: EGame,
): Promise<string> {
  const { leagues } = await queryClient.ensureQueryData(
    gameDropRatesQueryOptions(game),
  );
  const stored = loadLeagueSlugs()[game];
  const league = resolveSelectedLeague(leagues, stored);
  return leagueToSlug(league);
}
