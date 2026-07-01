import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDropRatesIndex } from "./getDropRatesIndex";

export const dropRatesIndexQueryOptions = queryOptions({
  queryKey: ["drop-rates-index"],
  queryFn: getDropRatesIndex,
  staleTime: 1000 * 60 * 60 * 24,
  gcTime: 1000 * 60 * 60 * 24,
});

export function useDropRatesIndex() {
  return useQuery(dropRatesIndexQueryOptions);
}
