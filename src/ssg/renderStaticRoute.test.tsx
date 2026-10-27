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
  context: null,
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
  {
    pathname: "/path-of-exile/standard/stacked-decks/compare/movers",
    browserPathname: "/path-of-exile/standard/stacked-decks/compare/movers",
  },
  {
    pathname: "/path-of-exile/standard/stacked-decks/compare/matrix",
    browserPathname: "/path-of-exile/standard/stacked-decks/compare/matrix",
  },
  {
    pathname: "/path-of-exile/standard/stacked-decks/compare/history",
    browserPathname: "/path-of-exile/standard/stacked-decks/compare/history",
  },
  { pathname: "/soothsayer", browserPathname: "/soothsayer" },
  { pathname: "/attributions", browserPathname: "/attributions" },
  { pathname: "/privacy-policy", browserPathname: "/privacy-policy" },
  { pathname: "/404", browserPathname: "/404" },
];

function renderTestRoute(pathname: string) {
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

  return renderStaticRoute({
    pathname,
    dropRatesIndex: DROP_RATES_INDEX,
    gameDropRates: GAME_DROP_RATES,
    prerenderData,
  });
}

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

    const markup = await renderTestRoute(pathname);

    expect(markup).toContain("min-h-screen");
    expect(markup).toContain('class="$tsr"');
    expect(markup).toContain("self.$_TSR");
    expect(markup).not.toContain('<article class="prose max-w-none">');
    if (pathname.includes("/cards") || pathname.endsWith("/stacked-decks")) {
      expect(markup).toContain(CARD.name);
    }
    if (pathname.includes("/stacked-decks/compare/")) {
      expect(markup).toContain("Compare Stacked Decks");
      expect(markup).toContain("Comparison settings");
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

  it("renders the footer destinations and logo without a beta badge", async () => {
    const container = document.createElement("div");
    container.innerHTML = await renderTestRoute("/");
    const footer = container.querySelector("footer");

    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("Maintainers");

    const footerLinks = Array.from(footer?.querySelectorAll("a") ?? []);
    const expectedExternalLinks = [
      ["Discord", "https://discord.com/invite/5rnWW6Mfa4"],
      ["GitHub", "https://github.com/navali-creations/wraeclast-cards"],
      ["Bloderyn", "https://bloderyn.com/"],
      ["Ailu", "https://github.com/sbsrnt"],
    ] as const;

    for (const [label, href] of expectedExternalLinks) {
      const link = footerLinks.find(
        (candidate) => candidate.textContent?.trim() === label,
      );

      expect(link, `${label} footer link`).toBeDefined();
      expect(link?.getAttribute("href")).toBe(href);
      expect(link?.getAttribute("target")).toBe("_blank");
      expect(link?.getAttribute("rel")?.split(/\s+/)).toEqual(
        expect.arrayContaining(["noreferrer", "noopener"]),
      );
      expect(link?.querySelector("svg")).not.toBeNull();
    }

    const siteLogos = Array.from(container.querySelectorAll("a")).filter(
      (link) => link.textContent?.trim() === "wraeclast.cards",
    );
    expect(siteLogos).toHaveLength(2);
    expect(siteLogos.every((logo) => !logo.textContent?.includes("beta"))).toBe(
      true,
    );
  });

  it("renders Bloderyn's website link inside the attribution content", async () => {
    const container = document.createElement("div");
    container.innerHTML = await renderTestRoute("/attributions");
    const main = container.querySelector("main");
    const headings = Array.from(main?.querySelectorAll("h3") ?? []);
    const websiteLink = main?.querySelector<HTMLAnchorElement>(
      'a[href="https://bloderyn.com/"]',
    );

    expect(
      headings.some((heading) => heading.textContent?.trim() === "Bloderyn"),
    ).toBe(true);
    expect(main?.textContent).toContain(
      "Bloderyn created the design of wraeclast.cards",
    );
    expect(websiteLink?.textContent).toBe("https://bloderyn.com/");
  });
});
