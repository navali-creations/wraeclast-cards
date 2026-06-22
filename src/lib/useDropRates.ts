import { useQuery } from "@tanstack/react-query";

export interface DropRateLeague {
  id: string;
  name: string;
}

export interface GameDropRates {
  game: string;
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

export function useGameDropRates(game: "poe1" | "poe2") {
  return useQuery({
    queryKey: ["drop-rates", game],
    queryFn: () =>
      fetchDropRates<GameDropRates>(`/data/drop-rates/${game}/index.json`),
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
        `/data/drop-rates/${game}/${leagueId}.json`,
      ),
    enabled: !!leagueId,
    staleTime: 1000 * 60 * 60,
  });
}
