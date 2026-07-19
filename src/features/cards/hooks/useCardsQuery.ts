import { queryOptions, useQuery } from "@tanstack/react-query";
import { useGameContext } from "../../../app/game-context";
import type { EGame } from "../../../enums";
import { fetchLegacyCardDataUrl, getCards } from "../api/getCards";
import { getDivinationCardsDataKey } from "./divinationCardsData";
import { useSelectedCardsDataSource } from "./useSelectedCardsDataSource";

interface CardsQueryParams {
  game: EGame;
  cardDataUrl?: string;
  enabled?: boolean;
}

// Shared card-data settings for both useCardsQuery and manual cache reads.
export function cardsQueryOptions({
  game,
  cardDataUrl,
  enabled = true,
}: CardsQueryParams) {
  const sourceKey = getDivinationCardsDataKey(game, cardDataUrl);

  return queryOptions({
    queryKey: ["cards", game, sourceKey],
    queryFn: () => getCards({ game, cardDataUrl }),
    enabled,
    staleTime: Infinity,
  });
}

export function legacyCardDataUrlQueryOptions(
  leagueDataUrl: string | undefined,
) {
  return queryOptions({
    queryKey: ["cards-source", leagueDataUrl],
    queryFn: () => fetchLegacyCardDataUrl(leagueDataUrl),
    enabled: !!leagueDataUrl,
    staleTime: Infinity,
  });
}

export function useCardsQuery() {
  const { game } = useGameContext();
  const { cardDataUrl, leagueDataUrl } = useSelectedCardsDataSource();
  const shouldResolveLegacySource = !cardDataUrl && !!leagueDataUrl;
  const legacyCardDataUrlQuery = useQuery(
    legacyCardDataUrlQueryOptions(leagueDataUrl),
  );
  const resolvedCardDataUrl = cardDataUrl ?? legacyCardDataUrlQuery.data;

  return useQuery(
    cardsQueryOptions({
      game,
      cardDataUrl: resolvedCardDataUrl ?? undefined,
      enabled: !shouldResolveLegacySource || !legacyCardDataUrlQuery.isLoading,
    }),
  );
}
