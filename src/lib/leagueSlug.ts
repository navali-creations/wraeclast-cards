import type { DropRateLeague } from "./dropRates/types";

export const STANDARD_LEAGUE_SLUG = "standard";

// Placeholder used for games with no published league data yet (e.g. a
// brand-new game): lets /$game/$league routes resolve instead of 404ing.
const STANDARD_LEAGUE: DropRateLeague = {
  id: STANDARD_LEAGUE_SLUG,
  name: "Standard",
  historical: false,
  url: "",
  card_count: 0,
  generated_at: "",
};

export function leagueToSlug(league: DropRateLeague): string {
  return league.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findLeagueBySlug(
  leagues: DropRateLeague[],
  slug: string,
): DropRateLeague | undefined {
  return leagues.find((league) => leagueToSlug(league) === slug);
}

export function defaultLeague(leagues: DropRateLeague[]): DropRateLeague {
  return (
    leagues.find((league) => !league.historical) ??
    leagues[0] ??
    STANDARD_LEAGUE
  );
}

// Resolves the league a stored slug points to, falling back to the default
// league when there's no stored slug or it no longer matches a known league.
export function resolveSelectedLeague(
  leagues: DropRateLeague[],
  storedSlug: string | undefined,
): DropRateLeague {
  return (
    (storedSlug ? findLeagueBySlug(leagues, storedSlug) : undefined) ??
    defaultLeague(leagues)
  );
}

export function isValidLeagueSlug(
  leagues: DropRateLeague[],
  slug: string,
): boolean {
  if (leagues.length === 0) return slug === STANDARD_LEAGUE_SLUG;
  return !!findLeagueBySlug(leagues, slug);
}
