import { createFileRoute } from "@tanstack/react-router";
import { CardDetailsPage } from "../../../../features/cards/routes";
import { loadCardSeoRouteData } from "../../../../features/cards/routes/CardDetailsPage/CardDetailsPage/CardDetailsPage.utils";
import { slugToGame } from "../../../../lib/gameSlug";
import { createGameLeagueCardSeoHead } from "../../../../lib/seo";

export const Route = createFileRoute("/$game/$league/cards/$cardId")({
  loader: ({ context: { queryClient }, params }) => {
    const game = slugToGame(params.game);
    if (!game) return undefined;

    return loadCardSeoRouteData(
      queryClient,
      game,
      params.league,
      params.cardId,
    );
  },
  head: ({ params, loaderData }) => {
    const game = slugToGame(params.game);
    if (!game) return {};

    return createGameLeagueCardSeoHead({
      game,
      leagueSlug: params.league,
      cardId: params.cardId,
      ...loaderData,
    });
  },
  component: CardDetailsPage,
});
