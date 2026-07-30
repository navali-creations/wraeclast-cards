// @vitest-environment jsdom

import { hydrate, RouterClient } from "@tanstack/react-router/ssr/client";
import { act, StrictMode } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../app/App";
import { createAppQueryClient } from "../app/queryClient";
import { createAppRouter } from "../router";
import { renderStaticRoute } from "./renderStaticRoute";

const LEAGUE = {
  id: "standard",
  name: "Standard",
  historical: false,
  url: "",
  card_count: 0,
  generated_at: "",
};

const DROP_RATES_INDEX = {
  schema_version: 1,
  generated_at: "",
  games: {
    poe1: { leagues: [LEAGUE] },
    poe2: { leagues: [LEAGUE] },
  },
};

const GAME_DROP_RATES = {
  poe1: {
    schema_version: 1,
    generated_at: "",
    game: "poe1",
    leagues: [LEAGUE],
  },
  poe2: {
    schema_version: 1,
    generated_at: "",
    game: "poe2",
    leagues: [LEAGUE],
  },
};

const CARD = {
  id: "a-chilling-wind",
  name: "A Chilling Wind",
  imageUrl: "https://example.com/a-chilling-wind.png",
  frameUrl: "https://example.com/frame.png",
  separatorUrl: "https://example.com/separator.png",
  rewardText: "The Halcyon",
  rewardHtml: "The Halcyon",
  rewardSearchText: "the halcyon",
  rewardTags: [],
  stackSize: 4,
  dropLocations: [],
  rarity: 3 as const,
  weight: 100,
  fromBoss: false,
  isDisabled: false,
};

const LEAGUE_DROP_RATES = {
  schema_version: 1,
  generated_at: "",
  game: "poe1" as const,
  league: { id: "standard", name: "Standard", historical: false },
  reference: null,
  cards: [
    {
      name: CARD.name,
      count: 12,
      ratio: 0.0125,
      verified_count: 10,
      verified_ratio: 0.01,
      reference_estimated_chance: null,
      seen_vs_reference: null,
      verified_seen_vs_reference: null,
      reference_weight: null,
      community_estimated_weight: null,
      verified_community_estimated_weight: null,
      community_estimated_weight_delta_vs_reference: null,
      verified_community_estimated_weight_delta_vs_reference: null,
    },
  ],
};

const ROUTES = [
  { pathname: "/", browserPathname: "/" },
  {
    pathname: "/path-of-exile/standard",
    browserPathname: "/path-of-exile/standard",
  },
  {
    pathname: "/path-of-exile/standard/cards",
    browserPathname: "/path-of-exile/standard/cards",
  },
  {
    pathname: "/path-of-exile/standard/cards/a-chilling-wind",
    browserPathname: "/path-of-exile/standard/cards/a-chilling-wind",
  },
  {
    pathname: "/path-of-exile/standard/stacked-decks",
    browserPathname: "/path-of-exile/standard/stacked-decks",
  },
  { pathname: "/soothsayer", browserPathname: "/soothsayer" },
  { pathname: "/privacy-policy", browserPathname: "/privacy-policy" },
  { pathname: "/404", browserPathname: "/404" },
];

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  window.history.replaceState({}, "", "/");
  delete window.$_TSR;
});

describe("renderStaticRoute", () => {
  it.each(
    ROUTES,
  )("renders $pathname and hydrates at $browserPathname without replacing its DOM", async ({
    pathname,
    browserPathname,
  }) => {
    window.history.replaceState({}, "", browserPathname);
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => undefined)),
    );

    const prerenderData =
      pathname === "/404"
        ? undefined
        : {
            game: "poe1" as const,
            league: LEAGUE,
            cards: [CARD],
            dropRates: LEAGUE_DROP_RATES,
            compactQueryState: pathname.endsWith("/a-chilling-wind"),
          };
    const markup = await renderStaticRoute({
      pathname,
      dropRatesIndex: DROP_RATES_INDEX,
      gameDropRates: GAME_DROP_RATES,
      prerenderData,
    });

    expect(markup).toContain("min-h-screen");
    expect(markup).toContain('class="$tsr"');
    expect(markup).toContain("self.$_TSR");
    expect(markup).not.toContain('<article class="prose max-w-none">');
    if (pathname.includes("/cards") || pathname.includes("/stacked-decks")) {
      expect(markup).toContain(CARD.name);
    }
    if (pathname === "/404") {
      expect(markup).toContain("Page not found");
    }

    const container = document.createElement("div");
    container.id = "root";
    container.innerHTML = markup;
    document.body.append(container);
    document.head.innerHTML =
      '<title data-seo-static>Static title</title><meta data-seo-static name="description" content="Static description">';

    const bootstrapScript = container.querySelector<HTMLScriptElement>(
      'script[id="$tsr-stream-barrier"]',
    );
    expect(bootstrapScript?.textContent).toBeTruthy();
    // biome-ignore lint/security/noGlobalEval: execute only the trusted router bootstrap generated above
    window.eval(
      bootstrapScript?.textContent?.replace(
        /;document\.currentScript\.remove\(\)$/,
        "",
      ) ?? "",
    );
    bootstrapScript?.remove();

    const queryClient = createAppQueryClient();
    const router = createAppRouter({ queryClient, prerender: true });
    const recoverableErrors: unknown[] = [];
    let root: Root | undefined;

    await hydrate(router);
    expect(router.stores.matchesId.get().length).toBeGreaterThan(0);

    await act(async () => {
      root = hydrateRoot(
        container,
        <StrictMode>
          <App
            queryClient={queryClient}
            router={router}
            routerContent={<RouterClient router={router} />}
          />
        </StrictMode>,
        {
          onRecoverableError: (error) => recoverableErrors.push(error),
        },
      );
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);
    expect(container.textContent).toContain("wraeclast.cards");
    expect(document.head.querySelector("[data-seo-static]")).toBeNull();
    expect(document.title).not.toBe("Static title");

    await act(async () => {
      root?.unmount();
    });
    queryClient.clear();
  });
});
