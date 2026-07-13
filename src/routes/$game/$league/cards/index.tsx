import { createFileRoute } from "@tanstack/react-router";
import { CardsPage } from "../../../../features/cards/routes";
import { slugToGame } from "../../../../lib/gameSlug";
import { asPage, asString, asTrueFlag } from "../../../../lib/searchParams";
import { createGameLeagueSeoHead } from "../../../../lib/seo";

export type CardsSearchParams = {
  name?: string;
  sortBy?: string;
  sortDesc?: true;
  page?: number;
};

export function validateCardsSearch(
  search: Record<string, unknown>,
): CardsSearchParams {
  return {
    name: asString(search.name),
    sortBy: asString(search.sortBy),
    sortDesc: asTrueFlag(search.sortDesc),
    page: asPage(search.page),
  };
}

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
