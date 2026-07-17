import { fetchDropRatesData } from "../../../../lib/dropRates";
import type { DropRatesLeague } from "../../types";

type GameIndex = {
  url: string;
  league_count: number;
  leagues: DropRatesLeague[];
};

export type DropRatesIndex = {
  schema_version: number;
  generated_at: string;
  games: {
    poe1: GameIndex;
    poe2: GameIndex;
  };
};

function isDropRatesIndex(value: unknown): value is DropRatesIndex {
  if (!value || typeof value !== "object") return false;

  const data = value as Partial<DropRatesIndex>;
  return !!data.games?.poe1 && !!data.games?.poe2;
}

export async function getDropRatesIndex() {
  const data = await fetchDropRatesData("index.json");
  if (!isDropRatesIndex(data)) {
    throw new Error("Unexpected drop rates index shape");
  }
  return data;
}
