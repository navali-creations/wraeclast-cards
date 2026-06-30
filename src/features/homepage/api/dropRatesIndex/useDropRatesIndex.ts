import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDropRatesIndex } from "./getDropRatesIndex";

export const dropRatesIndexQueryOptions = queryOptions({
  queryKey: ["drop-rates-index"],
  queryFn: getDropRatesIndex,
  staleTime: Infinity,
  gcTime: Infinity,
});

export function useDropRatesIndex() {
  return useQuery(dropRatesIndexQueryOptions);
}
