import { queryOptions, useQuery } from "@tanstack/react-query";
import { readJsonResponse } from "../readJsonResponse";
import {
  normalizeGameDropRates,
  normalizeLeagueDropRates,
} from "./normalizers";
import type { Game, GameDropRates, LeagueDropRates } from "./types";

const ONE_HOUR_MS = 1000 * 60 * 60;
const DEFAULT_DROP_RATES_BASE_URL = "/data/drop-rates";
const PRODUCTION_DROP_RATES_BASE_URL =
  "https://wraeclast.cards/data/drop-rates";

// Raw JSON fetcher; callers normalize the payload before it reaches React.
async function readDropRatesUrl(url: string): Promise<unknown> {
  const response = await fetch(url);
  return readJsonResponse(response, `Drop rates data from ${url}`);
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
    return PRODUCTION_DROP_RATES_BASE_URL;
  }

  return DEFAULT_DROP_RATES_BASE_URL;
}

// Joins the base URL with path segments (e.g. game, league id) into a full
// drop-rates file URL, escaping each segment.
function buildDropRatesUrl(baseUrl: string, ...segments: string[]) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

  return `${normalizedBaseUrl}/${segments.map(encodeURIComponent).join("/")}`;
}

function shouldRetryWithProduction(baseUrl: string) {
  return (
    import.meta.env.DEV &&
    !import.meta.env.VITE_DROP_RATES_BASE_URL &&
    baseUrl === DEFAULT_DROP_RATES_BASE_URL
  );
}

export async function fetchDropRatesData(
  ...segments: string[]
): Promise<unknown> {
  const baseUrl = getDropRatesBaseUrl();
  const primaryUrl = buildDropRatesUrl(baseUrl, ...segments);

  try {
    return await readDropRatesUrl(primaryUrl);
  } catch (error) {
    if (!shouldRetryWithProduction(baseUrl)) throw error;

    console.warn(
      "Local drop-rate data is unavailable; using production data instead.",
      error,
    );

    return readDropRatesUrl(
      buildDropRatesUrl(PRODUCTION_DROP_RATES_BASE_URL, ...segments),
    );
  }
}

// Fetches a game's league index (`<game>/index.json`), listing all leagues
// with drop-rate data available for that game. Shared between the hook below
// and route loaders that need to resolve a league slug via queryClient.ensureQueryData.
export function gameDropRatesQueryOptions(game: Game) {
  return queryOptions({
    queryKey: ["drop-rates", game],
    queryFn: async (): Promise<GameDropRates> =>
      normalizeGameDropRates(
        await fetchDropRatesData(game, "index.json"),
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
        await fetchDropRatesData(game, `${leagueId}.json`),
        game,
      ),
    enabled: !!leagueId,
    staleTime: ONE_HOUR_MS,
  });
}
