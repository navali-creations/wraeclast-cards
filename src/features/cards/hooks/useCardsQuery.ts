import { queryOptions, useQuery } from "@tanstack/react-query";
import { useGameContext } from "../../../app/game-context";
import type { EGame } from "../../../enums";
import { getDivinationCardsDataKey } from "../../../lib/divinationCards";
import { fetchLegacyCardDataUrl, getCards } from "../api/getCards";
import { useSelectedCardsDataSource } from "./useSelectedCardsDataSource";

interface CardsQueryParams {
  game: EGame;
  cardDataUrl?: string;
  allowDefaultSource?: boolean;
  enabled?: boolean;
}

// Shared card-data settings for both useCardsQuery and manual cache reads.
export function cardsQueryOptions({
  game,
  cardDataUrl,
  allowDefaultSource = true,
  enabled = true,
}: CardsQueryParams) {
  const sourceKey = getDivinationCardsDataKey(game, cardDataUrl, {
    allowDefaultSource,
  });

  return queryOptions({
    queryKey: ["cards", game, sourceKey],
    queryFn: () => getCards({ game, cardDataUrl, allowDefaultSource }),
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
  const { cardDataUrl, leagueDataUrl, allowDefaultSource } =
    useSelectedCardsDataSource();
  const shouldResolveLegacySource = !cardDataUrl && !!leagueDataUrl;
  const legacyCardDataUrlQuery = useQuery(
    legacyCardDataUrlQueryOptions(
      shouldResolveLegacySource ? leagueDataUrl : undefined,
    ),
  );
  const resolvedCardDataUrl = cardDataUrl ?? legacyCardDataUrlQuery.data;

  return useQuery(
    cardsQueryOptions({
      game,
      cardDataUrl: resolvedCardDataUrl ?? undefined,
      allowDefaultSource,
      enabled: !shouldResolveLegacySource || !legacyCardDataUrlQuery.isLoading,
    }),
  );
}
