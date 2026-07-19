import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  normalizeGameDropRates,
  normalizeLeagueDropRates,
} from "./normalizers";
import type { Game, GameDropRates, LeagueDropRates } from "./types";

const ONE_HOUR_MS = 1000 * 60 * 60;
const DROP_RATES_PATH_PREFIX = "/data/drop-rates";

// Raw JSON fetcher; callers normalize the payload before it reaches React.
async function fetchDropRates(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch drop rates from ${url}`);
  }
  return response.json();
}

// Where the static drop-rate JSON files are hosted: an env override for
// local/preview builds, the production domain when running on a
// *.wraeclast-cards.pages.dev preview deploy, otherwise a same-origin path.
export function getDropRatesBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_DROP_RATES_BASE_URL;
  if (configuredBaseUrl) return configuredBaseUrl;

  if (
    typeof window !== "undefined" &&
    window.location.hostname.endsWith(".wraeclast-cards.pages.dev")
  ) {
    return "https://wraeclast.cards/data/drop-rates";
  }

  return "/data/drop-rates";
}

export function resolveDropRatesUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;

  const baseUrl = getDropRatesBaseUrl().replace(/\/+$/, "");
  const normalizedPath = pathOrUrl
    .replace(
      new RegExp(`^/?${DROP_RATES_PATH_PREFIX.replace(/^\//, "")}/?`),
      "",
    )
    .replace(/^\/+/, "");

  return normalizedPath ? `${baseUrl}/${normalizedPath}` : baseUrl;
}

// Joins the base URL with path segments (e.g. game, league id) into a full
// drop-rates file URL, escaping each segment.
export function buildDropRatesUrl(...segments: string[]) {
  return resolveDropRatesUrl(segments.map(encodeURIComponent).join("/"));
}

// Fetches a game's league index (`<game>/index.json`), listing all leagues
// with drop-rate data available for that game. Shared between the hook below
// and route loaders that need to resolve a league slug via queryClient.ensureQueryData.
export function gameDropRatesQueryOptions(game: Game) {
  return queryOptions({
    queryKey: ["drop-rates", game],
    queryFn: async (): Promise<GameDropRates> =>
      normalizeGameDropRates(
        await fetchDropRates(buildDropRatesUrl(game, "index.json")),
        game,
      ),
    staleTime: ONE_HOUR_MS,
  });
}

export function useGameDropRates(game: Game) {
  return useQuery(gameDropRatesQueryOptions(game));
}

// Fetches the card drop rates for one league (`<game>/<leagueId>.json`).
// Disabled until a leagueId is known.
export function useLeagueDropRates(game: Game, leagueId: string | undefined) {
  return useQuery({
    queryKey: ["drop-rates", game, leagueId],
    queryFn: async (): Promise<LeagueDropRates> =>
      normalizeLeagueDropRates(
        await fetchDropRates(buildDropRatesUrl(game, `${leagueId}.json`)),
        game,
      ),
    enabled: !!leagueId,
    staleTime: ONE_HOUR_MS,
  });
}
