import { queryOptions, useQuery } from "@tanstack/react-query";
import { getCards } from "../api/getCards";

// Shared card-data settings for both useCardsQuery and manual cache reads.
export function cardsQueryOptions() {
  return queryOptions({
    queryKey: ["cards"],
    queryFn: getCards,
    staleTime: Infinity,
  });
}

export function useCardsQuery() {
  return useQuery(cardsQueryOptions());
}
