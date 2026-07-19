import {
  buildDropRatesUrl,
  type DropRatesIndex,
  normalizeDropRatesIndex,
} from "../../../../lib/dropRates";

export type { DropRatesIndex };

export async function getDropRatesIndex(): Promise<DropRatesIndex> {
  const res = await fetch(buildDropRatesUrl("index.json"));
  if (!res.ok)
    throw new Error(`Failed to fetch drop rates index: ${res.status}`);
  return normalizeDropRatesIndex(await res.json());
}
