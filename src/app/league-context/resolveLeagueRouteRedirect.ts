import type { QueryClient } from "@tanstack/react-query";
import type { EGame } from "../../enums";
import { gameDropRatesQueryOptions } from "../../lib/dropRates";
import { isValidLeagueSlug } from "../../lib/leagueSlug";
import { resolveDefaultLeagueSlug } from "./resolveDefaultLeagueSlug";

// Resolves the redirect href for a /$game/$league route when the league
// segment doesn't match any known league (rotated league, typo, stale
// bookmark). Swaps just the league segment, keeping whatever page (cards,
// stacked-decks, ...) and search params the user was actually headed to.
// Returns undefined when the current league slug is already valid.
export async function resolveLeagueRouteRedirect(
  queryClient: QueryClient,
  game: EGame,
  params: { game: string; league: string },
  href: string,
): Promise<string | undefined> {
  const { leagues } = await queryClient.ensureQueryData(
    gameDropRatesQueryOptions(game),
  );
  if (isValidLeagueSlug(leagues, params.league)) return undefined;

  const fallbackSlug = await resolveDefaultLeagueSlug(queryClient, game);

  return href.replace(
    `/${params.game}/${params.league}`,
    `/${params.game}/${fallbackSlug}`,
  );
}
