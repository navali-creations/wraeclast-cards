import { queryOptions, useQuery } from "@tanstack/react-query";
import { useGameContext } from "../../../app/game-context";
import { useLeagueContext } from "../../../app/league-context";
import type { EGame } from "../../../enums";
import { getCards } from "../api/getCards";

interface CardsQueryParams {
  game: EGame;
  leagueName?: string;
}

// Shared card-data settings for both useCardsQuery and manual cache reads.
export function cardsQueryOptions({ game, leagueName }: CardsQueryParams) {
  return queryOptions({
    queryKey: ["cards", game, leagueName],
    queryFn: () => getCards({ game, leagueName }),
    staleTime: Infinity,
  });
}

export function useCardsQuery() {
  const { game } = useGameContext();
  const { selectedLeague } = useLeagueContext();

  return useQuery(cardsQueryOptions({ game, leagueName: selectedLeague.name }));
}
