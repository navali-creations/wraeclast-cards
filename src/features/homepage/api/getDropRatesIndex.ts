import { useQuery } from "@tanstack/react-query";
import type { DropRatesLeague } from "../types";

type GameIndex = {
  url: string;
  league_count: number;
  leagues: DropRatesLeague[];
};

type DropRatesIndex = {
  schema_version: number;
  generated_at: string;
  games: {
    poe1: GameIndex;
    poe2: GameIndex;
  };
};

export async function getDropRatesIndex(): Promise<DropRatesIndex> {
  const res = await fetch("/data/drop-rates/index.json");
  if (!res.ok)
    throw new Error(`Failed to fetch drop rates index: ${res.status}`);
  const data = await res.json();
  if (!data?.games?.poe1 || !data?.games?.poe2) {
    throw new Error("Unexpected drop rates index shape");
  }
  return data as DropRatesIndex;
}

export function useDropRatesIndex() {
  return useQuery({
    queryKey: ["drop-rates-index"],
    queryFn: getDropRatesIndex,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
