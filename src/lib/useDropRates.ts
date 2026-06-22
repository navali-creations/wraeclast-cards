import { useQuery } from "@tanstack/react-query";

export interface DropRateLeague {
  id: string;
  name: string;
  historical: boolean;
  url: string;
  card_count: number;
  generated_at: string;
}

export interface GameDropRates {
  url: string;
  league_count: number;
  leagues: DropRateLeague[];
}

export interface DropRateCard {
  name: string;
  count: number;
  ratio: number;
  contributors: number;
  verified_count: number;
  verified_contributors: number;
}

export interface LeagueDropRates {
  league_id: string;
  league_name: string;
  total_count: number;
  cards: DropRateCard[];
}

async function fetchDropRates<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch drop rates from ${url}`);
  }
  return response.json();
}

function buildDropRatesUrl(...segments: string[]) {
  const baseUrl = (
    import.meta.env.VITE_DROP_RATES_BASE_URL || "/data/drop-rates"
  ).replace(/\/+$/, "");

  return `${baseUrl}/${segments.map(encodeURIComponent).join("/")}`;
}

export function useGameDropRates(game: "poe1" | "poe2") {
  return useQuery({
    queryKey: ["drop-rates", game],
    queryFn: () =>
      fetchDropRates<GameDropRates>(buildDropRatesUrl(game, "index.json")),
    staleTime: 1000 * 60 * 60,
  });
}

export function useLeagueDropRates(
  game: "poe1" | "poe2",
  leagueId: string | undefined,
) {
  return useQuery({
    queryKey: ["drop-rates", game, leagueId],
    queryFn: () =>
      fetchDropRates<LeagueDropRates>(
        buildDropRatesUrl(game, `${leagueId}.json`),
      ),
    enabled: !!leagueId,
    staleTime: 1000 * 60 * 60,
  });
}
