import { createFileRoute } from "@tanstack/react-router";
import { validateCardsSearch } from "../../../../features/cards/cardsSearchParams";
import { CardsPage } from "../../../../features/cards/routes";
import { slugToGame } from "../../../../lib/gameSlug";
import { createGameLeagueSeoHead } from "../../../../lib/seo";

export const Route = createFileRoute("/$game/$league/cards/")({
  validateSearch: validateCardsSearch,
  head: ({ params }) => {
    const game = slugToGame(params.game);
    if (!game) return {};

    return createGameLeagueSeoHead({
      game,
      leagueSlug: params.league,
      page: "cards",
    });
  },
  component: CardsPage,
});
