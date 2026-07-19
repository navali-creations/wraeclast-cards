import { EGame } from "../../src/enums";
import { getDivinationCardsDataSource } from "../../src/features/cards/hooks/divinationCardsData";
import {
  normalizeDropRatesIndex,
  normalizeLeagueDropRates,
} from "../../src/lib/dropRates/normalizers";
import type { DropRateLeague, Game } from "../../src/lib/dropRates/types";
import { findLeagueBySlug } from "../../src/lib/leagueSlug";
import {
  fallbackPage,
  htmlEscape,
  renderSeoDocument,
} from "../../src/lib/seoDocument";
import {
  type CardSeoFacts,
  createCardSeoMetadata,
  SITE_NAME,
  SITE_URL,
} from "../../src/lib/seoMetadata";

const APP_SHELL_PATH = "/_app-shell";
const DROP_RATES_INDEX_PATH = "/data/drop-rates/index.json";
const MAX_JSON_BYTES = 2_000_000;
const PAGE_CACHE_CONTROL =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
const NOT_FOUND_CACHE_CONTROL = "public, max-age=60, s-maxage=300";

type CardRouteParam = "league" | "cardId";
type CardPageContext = EventContext<
  unknown,
  CardRouteParam,
  Record<string, unknown>
>;

interface GameConfig {
  game: Game;
  gameLabel: string;
  gameSeoLabel: string;
  gameSlug: "path-of-exile" | "path-of-exile-2";
}

interface RawCard {
  name: string;
  stack_size: number;
  description: string;
  art_src?: string;
  from_boss?: boolean;
  weight?: number;
}

const GAME_CONFIG: Record<Game, GameConfig> = {
  poe1: {
    game: "poe1",
    gameLabel: "PoE 1",
    gameSeoLabel: "Path of Exile",
    gameSlug: "path-of-exile",
  },
  poe2: {
    game: "poe2",
    gameLabel: "PoE 2",
    gameSeoLabel: "Path of Exile 2",
    gameSlug: "path-of-exile-2",
  },
};

function routeParam(value: string | string[]): string {
  const parameter = Array.isArray(value) ? value[0] : value;

  try {
    return decodeURIComponent(parameter);
  } catch {
    return parameter;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function optionalBoolean(value: unknown): value is boolean | undefined {
  return value === undefined || typeof value === "boolean";
}

function optionalNumber(value: unknown): value is number | undefined {
  return (
    value === undefined || (typeof value === "number" && Number.isFinite(value))
  );
}

function isRawCard(value: unknown): value is RawCard {
  if (!isRecord(value)) return false;

  return (
    typeof value.name === "string" &&
    typeof value.stack_size === "number" &&
    Number.isFinite(value.stack_size) &&
    typeof value.description === "string" &&
    optionalString(value.art_src) &&
    optionalBoolean(value.from_boss) &&
    optionalNumber(value.weight)
  );
}

async function readJson(response: Response, label: string): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`${label} returned ${response.status}`);
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);
  if (contentLength > MAX_JSON_BYTES) {
    throw new Error(`${label} exceeds ${MAX_JSON_BYTES} bytes`);
  }

  const body = await response.text();
  if (body.length > MAX_JSON_BYTES) {
    throw new Error(`${label} exceeds ${MAX_JSON_BYTES} bytes`);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${label} is not valid JSON`);
  }
}

function productionAssetUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).href;
}

async function fetchPublishedAsset(
  context: CardPageContext,
  pathname: string,
): Promise<Response> {
  const assetUrl = new URL(pathname, context.request.url);
  const response = await context.env.ASSETS.fetch(assetUrl);
  if (
    response.ok ||
    new URL(context.request.url).hostname === "wraeclast.cards"
  ) {
    return response;
  }

  return fetch(productionAssetUrl(pathname));
}

function leagueDataPath(league: DropRateLeague): string {
  const url = new URL(league.url, SITE_URL);
  if (
    url.origin !== SITE_URL ||
    !url.pathname.startsWith("/data/drop-rates/") ||
    !url.pathname.endsWith(".json")
  ) {
    throw new Error(`Invalid drop-rate data path for ${league.name}`);
  }

  return url.pathname;
}

function findCard(value: unknown, cardName: string): RawCard | undefined {
  if (!Array.isArray(value)) {
    throw new Error("Invalid divination card data");
  }

  const candidate = value.find(
    (item) => isRecord(item) && item.name === cardName,
  );
  if (!candidate) return undefined;
  if (!isRawCard(candidate)) {
    throw new Error(`Invalid divination card data for ${cardName}`);
  }

  return candidate;
}

function cardRarity(weight: number | undefined): string {
  if (typeof weight !== "number" || weight <= 0) return "Unknown";
  if (weight > 5000) return "Common";
  if (weight > 1000) return "Less common";
  if (weight > 30) return "Rare";
  return "Extremely rare";
}

function cardImageUrl(
  card: RawCard,
  imagesBaseUrl: string,
): string | undefined {
  if (!card.art_src) return undefined;

  return `${imagesBaseUrl}/${encodeURIComponent(card.art_src)}`;
}

function htmlResponse(
  html: string,
  shellResponse: Response,
  status: number,
  cacheControl: string,
): Response {
  const headers = new Headers(shellResponse.headers);
  headers.set("content-type", "text/html; charset=UTF-8");
  headers.set("cache-control", cacheControl);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("etag");
  headers.delete("last-modified");
  headers.delete("x-robots-tag");

  return new Response(html, { status, headers });
}

function headResponse(response: Response): Response {
  return new Response(null, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

function renderNotFound(
  shell: string,
  shellResponse: Response,
  pathname: string,
  cardsPath: string,
): Response {
  const html = renderSeoDocument(shell, {
    pathname,
    title: `Card Not Found | ${SITE_NAME}`,
    description: "The requested divination card could not be found.",
    robots: "noindex, nofollow",
    canonical: false,
    body: fallbackPage(`<article class="prose text-center">
      <h1>Card not found</h1>
      <p>The requested divination card is not available in this league.</p>
      <p><a href="${htmlEscape(cardsPath)}">Browse divination cards</a></p>
    </article>`),
  });

  return htmlResponse(html, shellResponse, 404, NOT_FOUND_CACHE_CONTROL);
}

function renderCardPage(
  shell: string,
  shellResponse: Response,
  config: GameConfig,
  league: DropRateLeague,
  leagueSlug: string,
  card: RawCard,
  imagesBaseUrl: string,
  observedCard: { count: number; ratio: number } | undefined,
): Response {
  const facts: CardSeoFacts = {
    name: card.name,
    rewardText: card.description,
    stackSize: card.stack_size,
    fromBoss: card.from_boss ?? false,
    rarity: cardRarity(card.weight),
    imageUrl: cardImageUrl(card, imagesBaseUrl),
    observedCount: observedCard?.count,
    observedRate: observedCard?.ratio,
  };
  const metadata = createCardSeoMetadata({
    gameLabel: config.gameLabel,
    gameSeoLabel: config.gameSeoLabel,
    gameSlug: config.gameSlug,
    leagueName: league.name,
    leagueSlug,
    facts,
  });
  const observedSection = observedCard
    ? `<section>
        <h2>${htmlEscape(league.name)} observed drop rate</h2>
        <p>${observedCard.count.toLocaleString("en-US")} reported drops, representing ${htmlEscape(`${(observedCard.ratio * 100).toFixed(6)}%`)} of observed stacked deck openings.</p>
      </section>`
    : "";
  const image = facts.imageUrl
    ? `<img src="${htmlEscape(facts.imageUrl)}" alt="${htmlEscape(`${card.name} divination card artwork`)}">`
    : "";
  const cardLabel = card.stack_size === 1 ? "card" : "cards";
  const body = fallbackPage(`<article class="prose max-w-none">
    <h1>${htmlEscape(card.name)} Divination Card</h1>
    <p>${htmlEscape(metadata.description)}</p>
    ${image}
    <dl>
      <dt>Reward</dt>
      <dd>${htmlEscape(card.description)}</dd>
      <dt>Stack size</dt>
      <dd>${card.stack_size.toLocaleString("en-US")} ${cardLabel}</dd>
      <dt>Rarity</dt>
      <dd>${htmlEscape(facts.rarity)}</dd>
      <dt>Source</dt>
      <dd>${facts.fromBoss ? "Boss drop" : "Not boss-specific"}</dd>
    </dl>
    ${observedSection}
    <p><a href="/${config.gameSlug}/${htmlEscape(leagueSlug)}/cards">Browse all ${htmlEscape(league.name)} divination cards</a></p>
  </article>`);
  const html = renderSeoDocument(shell, {
    ...metadata,
    body,
    seoPageFacts: facts,
  });

  return htmlResponse(html, shellResponse, 200, PAGE_CACHE_CONTROL);
}

async function buildCardPage(
  context: CardPageContext,
  config: GameConfig,
  leagueSlug: string,
  cardName: string,
): Promise<Response> {
  const [shellResponse, indexResponse] = await Promise.all([
    context.env.ASSETS.fetch(new URL(APP_SHELL_PATH, context.request.url)),
    fetchPublishedAsset(context, DROP_RATES_INDEX_PATH),
  ]);
  if (!shellResponse.ok) {
    throw new Error(`App shell returned ${shellResponse.status}`);
  }

  const [shell, indexValue] = await Promise.all([
    shellResponse.text(),
    readJson(indexResponse, "Drop-rate index"),
  ]);
  const index = normalizeDropRatesIndex(indexValue);
  const league = findLeagueBySlug(
    index.games[config.game]?.leagues ?? [],
    leagueSlug,
  );
  const cardsPath = `/${config.gameSlug}/${leagueSlug}/cards`;
  if (!league?.url) {
    return renderNotFound(
      shell,
      shellResponse,
      new URL(context.request.url).pathname,
      cardsPath,
    );
  }

  const leagueResponse = await fetchPublishedAsset(
    context,
    leagueDataPath(league),
  );
  const leagueData = normalizeLeagueDropRates(
    await readJson(leagueResponse, `${league.name} drop rates`),
    config.game,
  );
  const source = getDivinationCardsDataSource(
    config.game === "poe1" ? EGame.Poe1 : EGame.Poe2,
    league.reference_source_url ?? leagueData.reference?.source_url,
  );
  if (!source) {
    return renderNotFound(
      shell,
      shellResponse,
      new URL(context.request.url).pathname,
      cardsPath,
    );
  }

  const cardData = await readJson(
    await fetch(source.dataUrl),
    `${league.name} card data`,
  );
  const card = findCard(cardData, cardName);
  if (!card) {
    return renderNotFound(
      shell,
      shellResponse,
      new URL(context.request.url).pathname,
      cardsPath,
    );
  }

  const observedCard = leagueData.cards.find(
    (candidate) => (candidate.card_id ?? candidate.name) === card.name,
  );
  return renderCardPage(
    shell,
    shellResponse,
    config,
    league,
    leagueSlug,
    card,
    source.imagesBaseUrl,
    observedCard,
  );
}

export async function handleCardPage(
  context: CardPageContext,
  game: Game,
): Promise<Response> {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "GET, HEAD" },
    });
  }

  const requestUrl = new URL(context.request.url);
  if (requestUrl.pathname.endsWith("/")) {
    requestUrl.pathname = requestUrl.pathname.replace(/\/+$/, "");
    return Response.redirect(requestUrl.href, 308);
  }

  const cacheUrl = new URL(requestUrl);
  cacheUrl.search = "";
  const cacheKey = new Request(cacheUrl, { method: "GET" });
  const cache = caches.default;
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) {
    return context.request.method === "HEAD"
      ? headResponse(cachedResponse)
      : cachedResponse;
  }

  try {
    const response = await buildCardPage(
      context,
      GAME_CONFIG[game],
      routeParam(context.params.league),
      routeParam(context.params.cardId),
    );
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return context.request.method === "HEAD"
      ? headResponse(response)
      : response;
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "card_seo_render_failed",
        pathname: requestUrl.pathname,
        message: error instanceof Error ? error.message : String(error),
      }),
    );
    return new Response("Card page is temporarily unavailable", {
      status: 503,
      headers: {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=UTF-8",
        "retry-after": "60",
      },
    });
  }
}
