import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  resolveLeagueRouteRedirect,
  useSyncSelectedLeague,
} from "../../app/league-context";
import { slugToGame } from "../../lib/gameSlug";

export const Route = createFileRoute("/$game/$league")({
  beforeLoad: async ({ context: { queryClient }, params, location }) => {
    const game = slugToGame(params.game);
    if (!game) throw notFound();

    const redirectHref = await resolveLeagueRouteRedirect(
      queryClient,
      game,
      params,
      location.href,
    );
    if (redirectHref) throw redirect({ href: redirectHref });
  },
  component: LeagueLayout,
});

function LeagueLayout() {
  const { league: slug } = Route.useParams();
  useSyncSelectedLeague(slug);

  return <Outlet />;
}
