import {
  type DropRatesIndex,
  fetchDropRatesData,
  normalizeDropRatesIndex,
} from "../../../../lib/dropRates";

export type { DropRatesIndex };

export async function getDropRatesIndex(): Promise<DropRatesIndex> {
  const data = await fetchDropRatesData("index.json");
  return normalizeDropRatesIndex(data);
}
