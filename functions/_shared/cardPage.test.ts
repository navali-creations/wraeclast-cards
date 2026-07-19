import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleCardPage } from "./cardPage";

const SHELL = `<!doctype html><html><head><!--wraeclast-seo-head--></head><body><div id="root"></div><!--wraeclast-seo-body--></body></html>`;
const CARD_SOURCE_URL =
  "https://cdn.jsdelivr.net/npm/@navali/poe1-divination-cards@3.28.2/data/cards.json";
const DROP_RATES_INDEX = {
  schema_version: 5,
  generated_at: "2026-07-19T00:00:00.000Z",
  games: {
    poe1: {
      leagues: [
        {
          id: "keepers",
          name: "Keepers",
          historical: false,
          observed_total: 200,
          reference_source_url: CARD_SOURCE_URL,
          url: "/data/drop-rates/poe1/keepers.json",
          card_count: 1,
          generated_at: "2026-07-19T00:00:00.000Z",
        },
      ],
    },
  },
};
const LEAGUE_DROP_RATES = {
  schema_version: 5,
  generated_at: "2026-07-19T00:00:00.000Z",
  game: "poe1",
  league: { id: "keepers", name: "Keepers", historical: false },
  reference: { source_url: CARD_SOURCE_URL },
  cards: [{ name: "A Chilling Wind", count: 2, ratio: 0.01 }],
};
const CARDS = [
  {
    name: "A Chilling Wind",
    stack_size: 4,
    description: "The Halcyon",
    reward_html: "<span>The Halcyon</span>",
    from_boss: false,
    weight: 100,
  },
  {
    name: "The Unobserved Card",
    stack_size: 5,
    description: "A catalog reward",
    reward_html: "<span>A catalog reward</span>",
    from_boss: false,
    weight: 50,
  },
];

function jsonResponse(value: unknown) {
  return new Response(JSON.stringify(value), {
    headers: { "content-type": "application/json" },
  });
}

function createContext(pathname: string, cardId: string) {
  const pendingTasks: Promise<unknown>[] = [];
  const assetsFetch = vi.fn(async (input: unknown) => {
    const url = new URL(input instanceof Request ? input.url : String(input));

    if (url.pathname === "/_app-shell") return new Response(SHELL);
    if (url.pathname === "/data/drop-rates/index.json") {
      return jsonResponse(DROP_RATES_INDEX);
    }
    if (url.pathname === "/data/drop-rates/poe1/keepers.json") {
      return jsonResponse(LEAGUE_DROP_RATES);
    }

    return new Response("Not Found", { status: 404 });
  });
  const context = {
    request: new Request(`https://wraeclast.cards${pathname}`),
    params: { league: "keepers", cardId },
    env: { ASSETS: { fetch: assetsFetch } },
    waitUntil(promise: Promise<unknown>) {
      pendingTasks.push(promise);
    },
  } as unknown as Parameters<typeof handleCardPage>[0];

  return { context, pendingTasks };
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => jsonResponse(CARDS)),
  );
  vi.stubGlobal("caches", {
    default: {
      match: vi.fn(async () => undefined),
      put: vi.fn(async () => undefined),
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("handleCardPage", () => {
  it("renders observed-only HTML when the card catalog is unavailable", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Catalog unavailable"));
    const { context, pendingTasks } = createContext(
      "/path-of-exile/keepers/cards/a-chilling-wind",
      "a-chilling-wind",
    );
    const response = await handleCardPage(context, "poe1");
    const html = await response.text();
    await Promise.all(pendingTasks);

    expect(response.status).toBe(200);
    expect(html).toContain("<h1>A Chilling Wind Divination Card</h1>");
    expect(html).toContain("archived card catalog");
  });

  it("renders canonical, indexable HTML for an observed card", async () => {
    const { context, pendingTasks } = createContext(
      "/path-of-exile/keepers/cards/a-chilling-wind",
      "a-chilling-wind",
    );
    const response = await handleCardPage(context, "poe1");
    const html = await response.text();
    await Promise.all(pendingTasks);

    expect(response.status).toBe(200);
    expect(html).toContain(
      '<meta data-seo-static name="robots" content="index, follow">',
    );
    expect(html).toContain(
      '<link data-seo-static rel="canonical" href="https://wraeclast.cards/path-of-exile/keepers/cards/a-chilling-wind">',
    );
    expect(html).toContain("<h1>A Chilling Wind Divination Card</h1>");
  });

  it("indexes a catalog card without observed drops", async () => {
    const { context, pendingTasks } = createContext(
      "/path-of-exile/keepers/cards/the-unobserved-card",
      "the-unobserved-card",
    );
    const response = await handleCardPage(context, "poe1");
    const html = await response.text();
    await Promise.all(pendingTasks);

    expect(response.status).toBe(200);
    expect(html).toContain(
      '<meta data-seo-static name="robots" content="index, follow">',
    );
    expect(html).toContain("<h1>The Unobserved Card Divination Card</h1>");
    expect(html).toContain("No stacked deck drops have been reported");
  });

  it("redirects a legacy card id and preserves its query string", async () => {
    const { context } = createContext(
      "/path-of-exile/keepers/cards/A%20Chilling%20Wind?view=compact",
      "A Chilling Wind",
    );
    const response = await handleCardPage(context, "poe1");

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe(
      "https://wraeclast.cards/path-of-exile/keepers/cards/a-chilling-wind?view=compact",
    );
  });

  it("returns a noindex 404 without a canonical for a missing card", async () => {
    const { context, pendingTasks } = createContext(
      "/path-of-exile/keepers/cards/missing-card",
      "missing-card",
    );
    const response = await handleCardPage(context, "poe1");
    const html = await response.text();
    await Promise.all(pendingTasks);

    expect(response.status).toBe(404);
    expect(html).toContain(
      '<meta data-seo-static name="robots" content="noindex, nofollow">',
    );
    expect(html).not.toContain('rel="canonical"');
  });
});
