import { createFileRoute, redirect } from "@tanstack/react-router";
import { validateStackedDecksComparisonSearch } from "../../../features/stackedDecks/routes/StackedDecksComparisonPage/useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";

export const Route = createFileRoute("/$game/$league/stacked-decks_/compare/")({
  validateSearch: validateStackedDecksComparisonSearch,
  beforeLoad: ({ params, search }) => {
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
});
