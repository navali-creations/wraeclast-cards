import { createRootRouteWithContext, Scripts } from "@tanstack/react-router";
import { GameProvider } from "../app/game-context";
import { AppLayout } from "../app/layout/AppLayout";
import { LeagueProvider } from "../app/league-context";
import type { AppRouterContext } from "../app/routerContext";
import { DocumentHead } from "../components/document-head/DocumentHead/DocumentHead";
import { NotFoundPage } from "../components/not-found-page/NotFoundPage/NotFoundPage";

function RootComponent() {
  const { prerender } = Route.useRouteContext();

  return (
    <>
      <DocumentHead prerender={prerender} />
      <GameProvider>
        <LeagueProvider>
          <AppLayout />
        </LeagueProvider>
      </GameProvider>
      <Scripts />
    </>
  );
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});
