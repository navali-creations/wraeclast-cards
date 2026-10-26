import { createFileRoute } from "@tanstack/react-router";
import { StackedDecksComparisonPage } from "../../../features/stackedDecks/routes";
import { validateStackedDecksComparisonSearch } from "../../../features/stackedDecks/routes/StackedDecksComparisonPage/useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";
import { slugToGame } from "../../../lib/gameSlug";
import { createGameLeagueSeoHead } from "../../../lib/seo";

export const Route = createFileRoute("/$game/$league/stacked-decks_/compare")({
  validateSearch: validateStackedDecksComparisonSearch,
  head: ({ params }) => {
    const game = slugToGame(params.game);
    if (!game) return {};

    return createGameLeagueSeoHead({
      game,
      leagueSlug: params.league,
      page: "stacked-decks-compare",
    });
  },
  component: StackedDecksComparisonPage,
});
