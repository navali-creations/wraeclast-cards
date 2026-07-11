import { queryOptions, useQuery } from "@tanstack/react-query";
import type { Game, GameDropRates, LeagueDropRates } from "./types";

const ONE_HOUR_MS = 1000 * 60 * 60;

// Generic GET-and-parse-as-JSON used by both hooks below.
async function fetchDropRates<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch drop rates from ${url}`);
  }
  return response.json();
}

// Where the static drop-rate JSON files are hosted: an env override for
// local/preview builds, the production domain when running on a
// *.wraeclast-cards.pages.dev preview deploy, otherwise a same-origin path.
function getDropRatesBaseUrl() {
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

// Joins the base URL with path segments (e.g. game, league id) into a full
// drop-rates file URL, escaping each segment.
function buildDropRatesUrl(...segments: string[]) {
  const baseUrl = getDropRatesBaseUrl().replace(/\/+$/, "");

  return `${baseUrl}/${segments.map(encodeURIComponent).join("/")}`;
}

// Fetches a game's league index (`<game>/index.json`), listing all leagues
// with drop-rate data available for that game. Shared between the hook below
// and route loaders that need to resolve a league slug via queryClient.ensureQueryData.
export function gameDropRatesQueryOptions(game: Game) {
  return queryOptions({
    queryKey: ["drop-rates", game],
    queryFn: () =>
      fetchDropRates<GameDropRates>(buildDropRatesUrl(game, "index.json")),
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
    queryFn: () =>
      fetchDropRates<LeagueDropRates>(
        buildDropRatesUrl(game, `${leagueId}.json`),
      ),
    enabled: !!leagueId,
    staleTime: ONE_HOUR_MS,
  });
}
