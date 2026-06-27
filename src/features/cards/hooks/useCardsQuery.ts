import { useQuery } from "@tanstack/react-query";
import { getCards } from "../api/getCards";

export function useCardsQuery() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
    staleTime: Infinity,
  });
}
