import { createFileRoute } from "@tanstack/react-router";
import { dropRatesIndexQueryOptions } from "../../../features/homepage/api/dropRatesIndex";
import { HomepagePage } from "../../../features/homepage/routes/homepage";
import { slugToGame } from "../../../lib/gameSlug";
import { createGameLeagueSeoHead } from "../../../lib/seo";

export const Route = createFileRoute("/$game/$league/")({
  head: ({ params }) => {
    const game = slugToGame(params.game);
    if (!game) return {};

    return createGameLeagueSeoHead({
      game,
      leagueSlug: params.league,
      page: "home",
    });
  },
  component: HomepagePage,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(dropRatesIndexQueryOptions),
});
