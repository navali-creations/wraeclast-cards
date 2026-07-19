import { createFileRoute } from "@tanstack/react-router";
import { CardDetailsPage } from "../../../../features/cards/routes";
import { slugToGame } from "../../../../lib/gameSlug";
import { createGameLeagueCardSeoHead } from "../../../../lib/seo";

export const Route = createFileRoute("/$game/$league/cards/$cardId")({
  head: ({ params }) => {
    const game = slugToGame(params.game);
    if (!game) return {};

    return createGameLeagueCardSeoHead({
      game,
      leagueSlug: params.league,
      cardId: params.cardId,
    });
  },
  component: CardDetailsPage,
});
