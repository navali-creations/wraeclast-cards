import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useSyncSelectedGame } from "../app/game-context";
import { resolveDefaultLeagueSlug } from "../app/league-context";
import { slugToGame } from "../lib/gameSlug";

export const Route = createFileRoute("/$game")({
  params: {
    parse: (params) => {
      if (!slugToGame(params.game)) throw notFound();
      return { game: params.game };
    },
  },
  beforeLoad: async ({ context: { queryClient }, params, location }) => {
    // Bare /$game (no league segment) has no matching leaf route — resolve a
    // default league and redirect down into it instead of rendering blank.
    if (location.pathname !== `/${params.game}`) return;

    const game = slugToGame(params.game);
    if (!game) throw notFound();

    const league = await resolveDefaultLeagueSlug(queryClient, game);
    throw redirect({ href: `${location.pathname}/${league}` });
  },
  component: GameLayout,
});

function GameLayout() {
  const { game: slug } = Route.useParams();
  useSyncSelectedGame(slug);

  return <Outlet />;
}
