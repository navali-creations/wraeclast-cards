import { createFileRoute, redirect } from "@tanstack/react-router";
import { isComparisonView } from "../../../features/stackedDecks/routes/StackedDecksComparisonPage/StackedDecksComparisonPage.utils";
import { StackedDecksComparisonView } from "../../../features/stackedDecks/routes/StackedDecksComparisonPage/StackedDecksComparisonView/StackedDecksComparisonView";
import { validateStackedDecksComparisonSearch } from "../../../features/stackedDecks/routes/StackedDecksComparisonPage/useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";
import { slugToGame } from "../../../lib/gameSlug";
import { createGameLeagueSeoHead } from "../../../lib/seo";

export const Route = createFileRoute(
  "/$game/$league/stacked-decks_/compare/$comparisonView",
)({
  validateSearch: validateStackedDecksComparisonSearch,
  beforeLoad: ({ params, search }) => {
    if (isComparisonView(params.comparisonView)) return;

    throw redirect({
      to: "/$game/$league/stacked-decks/compare/$comparisonView",
      params: {
        game: params.game,
        league: params.league,
        comparisonView: "movers",
      },
      search,
      replace: true,
    });
  },
  head: ({ params }) => {
    const game = slugToGame(params.game);
    if (!game || !isComparisonView(params.comparisonView)) return {};

    return createGameLeagueSeoHead({
      game,
      leagueSlug: params.league,
      page: "stacked-decks-compare",
      comparisonView: params.comparisonView,
    });
  },
  component: StackedDecksComparisonView,
});
