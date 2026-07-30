import { createMemoryHistory } from "@tanstack/react-router";
import {
  attachRouterServerSsrUtils,
  RouterServer,
} from "@tanstack/react-router/ssr/server";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "../app/App";
import { createAppQueryClient } from "../app/queryClient";
import {
  cardsQueryOptions,
  legacyCardDataUrlQueryOptions,
} from "../features/cards/hooks";
import type { Card } from "../features/cards/types";
import { dropRatesIndexQueryOptions } from "../features/homepage/api/dropRatesIndex";
import {
  gameDropRatesQueryOptions,
  leagueDropRatesQueryOptions,
  normalizeDropRatesIndex,
  resolveDropRatesUrl,
} from "../lib/dropRates";
import {
  normalizeGameDropRates,
  normalizeLeagueDropRates,
} from "../lib/dropRates/normalizers";
import type {
  DropRateLeague,
  Game,
  LeagueDropRates,
} from "../lib/dropRates/types";
import { createAppRouter } from "../router";

interface PrerenderRouteData {
  game: Game;
  league: DropRateLeague;
  cards: Card[];
  dropRates: LeagueDropRates;
  compactQueryState?: boolean;
}

interface RenderStaticRouteOptions {
  pathname: string;
  dropRatesIndex: unknown;
  gameDropRates: Partial<Record<Game, unknown>>;
  prerenderData?: PrerenderRouteData;
}

const GAMES: Game[] = ["poe1", "poe2"];

function seedRouteData(
  queryClient: ReturnType<typeof createAppQueryClient>,
  prerenderData: PrerenderRouteData,
) {
  const { game, league, cards } = prerenderData;
  const dropRates = normalizeLeagueDropRates(prerenderData.dropRates, game);
  queryClient.setQueryData(
    leagueDropRatesQueryOptions(game, league.id).queryKey,
    dropRates,
  );

  const leagueDataUrl = league.url
    ? resolveDropRatesUrl(league.url)
    : undefined;
  const fallbackCardDataUrl = dropRates.reference?.source_url;
  if (league.reference_source_url === undefined && leagueDataUrl) {
    queryClient.setQueryData(
      legacyCardDataUrlQueryOptions(leagueDataUrl).queryKey,
      fallbackCardDataUrl ?? null,
    );
  }

  queryClient.setQueryData(
    cardsQueryOptions({
      game,
      cardDataUrl: league.reference_source_url ?? fallbackCardDataUrl,
      allowDefaultSource: !league.historical,
    }).queryKey,
    cards,
  );
}

function compactCardRouteQueries(
  queryClient: ReturnType<typeof createAppQueryClient>,
  prerenderData: PrerenderRouteData,
) {
  queryClient.removeQueries({ queryKey: ["cards"] });
  queryClient.removeQueries({ queryKey: ["cards-source"] });
  queryClient.removeQueries({
    queryKey: ["drop-rates", prerenderData.game, prerenderData.league.id],
    exact: true,
  });
}

export async function renderStaticRoute({
  pathname,
  dropRatesIndex,
  gameDropRates,
  prerenderData,
}: RenderStaticRouteOptions): Promise<string> {
  const queryClient = createAppQueryClient();
  queryClient.setQueryData(
    dropRatesIndexQueryOptions.queryKey,
    normalizeDropRatesIndex(dropRatesIndex),
  );

  for (const game of GAMES) {
    const gameIndex = gameDropRates[game];
    if (gameIndex === undefined) continue;

    queryClient.setQueryData(
      gameDropRatesQueryOptions(game).queryKey,
      normalizeGameDropRates(gameIndex, game),
    );
  }

  if (prerenderData) {
    seedRouteData(queryClient, prerenderData);
  }

  const router = createAppRouter({
    queryClient,
    history: createMemoryHistory({ initialEntries: [pathname] }),
    isServer: true,
    prerender: true,
  });

  attachRouterServerSsrUtils({ router, manifest: undefined });

  try {
    await router.load();
    if (prerenderData?.compactQueryState) {
      compactCardRouteQueries(queryClient, prerenderData);
    }
    await router.serverSsr?.dehydrate();

    const markup = renderToString(
      <StrictMode>
        <App
          queryClient={queryClient}
          router={router}
          routerContent={<RouterServer router={router} />}
        />
      </StrictMode>,
    );

    router.serverSsr?.setRenderFinished();
    const trailingMarkup = router.serverSsr?.takeBufferedHtml() ?? "";

    return `${markup}${trailingMarkup}`;
  } finally {
    router.serverSsr?.cleanup();
    queryClient.clear();
  }
}
