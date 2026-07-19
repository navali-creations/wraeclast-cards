import {
  createDivinationCardRouteIndex,
  divinationCardImageUrl,
  divinationCardRarityLabel,
  divinationCardRewardText,
  divinationCardSlug,
  getDivinationCardsDataSource,
  parseDivinationCards,
  type RawDivinationCard,
} from "../../src/lib/divinationCards";
import {
  normalizeDropRatesIndex,
  normalizeLeagueDropRates,
} from "../../src/lib/dropRates/normalizers";
import type { DropRateLeague, Game } from "../../src/lib/dropRates/types";
import { GAME_METADATA, type GameMetadata } from "../../src/lib/gameSlug";
import { findLeagueBySlug } from "../../src/lib/leagueSlug";
import {
  fallbackPage,
  htmlEscape,
  renderSeoDocument,
} from "../../src/lib/seoDocument";
import {
  type CardSeoFacts,
  createCardNotFoundSeoMetadata,
  createCardSeoMetadata,
  SITE_URL,
} from "../../src/lib/seoMetadata";

const APP_SHELL_PATH = "/_app-shell";
const DROP_RATES_INDEX_PATH = "/data/drop-rates/index.json";
const MAX_JSON_BYTES = 2_000_000;
const EXTERNAL_FETCH_TIMEOUT_MS = 8_000;
const MAX_CARD_CATALOG_CACHE_ENTRIES = 8;
const PAGE_CACHE_CONTROL = "public, max-age=300, s-maxage=3600";
const NOT_FOUND_CACHE_CONTROL = "public, max-age=60, s-maxage=300";
const cardCatalogCache = new Map<
  string,
  Promise<Map<string, RawDivinationCard>>
>();

type CardRouteParam = "league" | "cardId";
type CardPageContext = EventContext<
  unknown,
  CardRouteParam,
  Record<string, unknown>
>;

interface GameConfig extends GameMetadata {
  game: Game;
}

function routeParam(value: string | string[]): string {
  const parameter = Array.isArray(value) ? value[0] : value;

  try {
    return decodeURIComponent(parameter);
  } catch {
    return parameter;
  }
}

function canonicalCardRedirect(
  context: CardPageContext,
  config: GameConfig,
  leagueSlug: string,
  routeId: string,
  cardName: string,
): Response | null {
  const slug = divinationCardSlug(cardName);
  if (routeId === slug) return null;

  const url = new URL(context.request.url);
  url.pathname = `/${config.slug}/${leagueSlug}/cards/${slug}`;
  return Response.redirect(url.href, 308);
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

function loadCardCatalog(
  dataUrl: string,
): Promise<Map<string, RawDivinationCard>> {
  const cached = cardCatalogCache.get(dataUrl);
  if (cached) return cached;

  if (cardCatalogCache.size >= MAX_CARD_CATALOG_CACHE_ENTRIES) {
    const oldestKey = cardCatalogCache.keys().next().value;
    if (oldestKey !== undefined) cardCatalogCache.delete(oldestKey);
  }

  const loading = fetch(dataUrl, {
    signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
  })
    .then((response) => readJson(response, `Card data from ${dataUrl}`))
    .then(parseDivinationCards)
    .then(createDivinationCardRouteIndex)
    .catch((error) => {
      cardCatalogCache.delete(dataUrl);
      throw error;
    });
  cardCatalogCache.set(dataUrl, loading);
  return loading;
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

  return fetch(productionAssetUrl(pathname), {
    signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
  });
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
    ...createCardNotFoundSeoMetadata(pathname),
    seoPageStatus: "not-found",
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
  card: RawDivinationCard,
  imagesBaseUrl: string,
  observedCard: { count: number; ratio: number } | undefined,
): Response {
  const rewardText = divinationCardRewardText(card);
  const facts: CardSeoFacts = {
    name: card.name,
    slug: divinationCardSlug(card.name),
    rewardText,
    stackSize: card.stack_size,
    fromBoss: card.from_boss ?? false,
    rarity: divinationCardRarityLabel(card.weight),
    imageUrl: divinationCardImageUrl(card, imagesBaseUrl),
    observedCount: observedCard?.count,
    observedRate: observedCard?.ratio,
  };
  const metadata = createCardSeoMetadata({
    gameLabel: config.label,
    gameSeoLabel: config.seoLabel,
    gameSlug: config.slug,
    leagueName: league.name,
    leagueSlug,
    facts,
    robots: "index, follow",
  });
  const observedSection =
    observedCard && observedCard.count > 0
      ? `<section>
        <h2>${htmlEscape(league.name)} observed drop rate</h2>
        <p>${observedCard.count.toLocaleString("en-US")} reported drops, representing ${htmlEscape(`${(observedCard.ratio * 100).toFixed(6)}%`)} of observed stacked deck openings.</p>
      </section>`
      : `<section>
        <h2>${htmlEscape(league.name)} observed drop rate</h2>
        <p>No stacked deck drops have been reported for this card in ${htmlEscape(league.name)}.</p>
      </section>`;
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
      <dd>${htmlEscape(rewardText)}</dd>
      <dt>Stack size</dt>
      <dd>${card.stack_size.toLocaleString("en-US")} ${cardLabel}</dd>
      <dt>Rarity</dt>
      <dd>${htmlEscape(facts.rarity)}</dd>
      <dt>Source</dt>
      <dd>${facts.fromBoss ? "Boss drop" : "Not boss-specific"}</dd>
    </dl>
    ${observedSection}
    <p><a href="/${config.slug}/${htmlEscape(leagueSlug)}/cards">Browse all ${htmlEscape(league.name)} divination cards</a></p>
  </article>`);
  const html = renderSeoDocument(shell, {
    ...metadata,
    body,
    seoPageFacts: facts,
  });

  return htmlResponse(html, shellResponse, 200, PAGE_CACHE_CONTROL);
}

function renderObservedCardPage(
  shell: string,
  shellResponse: Response,
  config: GameConfig,
  league: DropRateLeague,
  leagueSlug: string,
  cardName: string,
  observedCard: { count: number; ratio: number },
): Response {
  const facts: CardSeoFacts = {
    name: cardName,
    slug: divinationCardSlug(cardName),
    observedCount: observedCard.count,
    observedRate: observedCard.ratio,
  };
  const metadata = createCardSeoMetadata({
    gameLabel: config.label,
    gameSeoLabel: config.seoLabel,
    gameSlug: config.slug,
    leagueName: league.name,
    leagueSlug,
    facts,
  });
  const body = fallbackPage(`<article class="prose max-w-none">
    <h1>${htmlEscape(cardName)} Divination Card</h1>
    <p>${htmlEscape(metadata.description)}</p>
    <section>
      <h2>${htmlEscape(league.name)} observed drop rate</h2>
      <p>${observedCard.count.toLocaleString("en-US")} reported drops, representing ${htmlEscape(`${(observedCard.ratio * 100).toFixed(6)}%`)} of observed stacked deck openings.</p>
    </section>
    <p>The archived card catalog for this league is not available, so current reward and stack-size details are intentionally omitted.</p>
    <p><a href="/${config.slug}/${htmlEscape(leagueSlug)}/stacked-decks">View all ${htmlEscape(league.name)} stacked deck rates</a></p>
  </article>`);
  const html = renderSeoDocument(shell, {
    ...metadata,
    body,
    seoPageFacts: facts,
  });

  return htmlResponse(html, shellResponse, 200, PAGE_CACHE_CONTROL);
}

function renderMissingCardPage(
  context: CardPageContext,
  shell: string,
  shellResponse: Response,
  config: GameConfig,
  league: DropRateLeague,
  leagueSlug: string,
  cardRouteId: string,
  cardsPath: string,
  observedCard: { name: string; count: number; ratio: number } | undefined,
): Response {
  if (observedCard && observedCard.count > 0) {
    const redirect = canonicalCardRedirect(
      context,
      config,
      leagueSlug,
      cardRouteId,
      observedCard.name,
    );
    if (redirect) return redirect;

    return renderObservedCardPage(
      shell,
      shellResponse,
      config,
      league,
      leagueSlug,
      observedCard.name,
      observedCard,
    );
  }

  return renderNotFound(
    shell,
    shellResponse,
    new URL(context.request.url).pathname,
    cardsPath,
  );
}

async function buildCardPage(
  context: CardPageContext,
  config: GameConfig,
  leagueSlug: string,
  cardRouteId: string,
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
  const cardsPath = `/${config.slug}/${leagueSlug}/cards`;
  if (!league?.url) {
    return renderNotFound(
      shell,
      shellResponse,
      new URL(context.request.url).pathname,
      cardsPath,
    );
  }

  const rootSourceUrl = league.reference_source_url;
  let source =
    rootSourceUrl === undefined
      ? null
      : getDivinationCardsDataSource(config.game, rootSourceUrl, {
          allowDefaultSource: false,
        });
  if (rootSourceUrl !== undefined && !source) {
    throw new Error(`Unsupported card data source for ${league.name}`);
  }

  const leagueResponsePromise = fetchPublishedAsset(
    context,
    leagueDataPath(league),
  );
  let cardCatalogError: unknown;
  const loadCatalog = (dataUrl: string) =>
    loadCardCatalog(dataUrl).catch((error) => {
      cardCatalogError = error;
      return null;
    });
  let cardCatalogPromise = source ? loadCatalog(source.dataUrl) : null;
  const leagueResponse = await leagueResponsePromise;
  const leagueData = normalizeLeagueDropRates(
    await readJson(leagueResponse, `${league.name} drop rates`),
    config.game,
  );
  const canonicalRouteId = divinationCardSlug(cardRouteId);
  const observedCard = leagueData.cards.find(
    (candidate) => divinationCardSlug(candidate.name) === canonicalRouteId,
  );
  const legacySourceUrl = leagueData.reference?.source_url;
  if (!source || !cardCatalogPromise) {
    source = getDivinationCardsDataSource(config.game, legacySourceUrl, {
      allowDefaultSource: !league.historical,
    });
    if (legacySourceUrl !== undefined && !source) {
      throw new Error(`Unsupported card data source for ${league.name}`);
    }
    cardCatalogPromise = source ? loadCatalog(source.dataUrl) : null;
  }

  if (!source || !cardCatalogPromise) {
    return renderMissingCardPage(
      context,
      shell,
      shellResponse,
      config,
      league,
      leagueSlug,
      cardRouteId,
      cardsPath,
      observedCard,
    );
  }

  const cardsByRouteId = await cardCatalogPromise;
  if (!cardsByRouteId) {
    if (observedCard && observedCard.count > 0) {
      console.warn(
        JSON.stringify({
          event: "card_catalog_fallback",
          pathname: new URL(context.request.url).pathname,
          message:
            cardCatalogError instanceof Error
              ? cardCatalogError.message
              : String(cardCatalogError),
        }),
      );
      return renderMissingCardPage(
        context,
        shell,
        shellResponse,
        config,
        league,
        leagueSlug,
        cardRouteId,
        cardsPath,
        observedCard,
      );
    }

    throw cardCatalogError instanceof Error
      ? cardCatalogError
      : new Error(`Could not load the card catalog for ${league.name}`);
  }

  const card = cardsByRouteId.get(canonicalRouteId);
  if (!card) {
    return renderMissingCardPage(
      context,
      shell,
      shellResponse,
      config,
      league,
      leagueSlug,
      cardRouteId,
      cardsPath,
      observedCard,
    );
  }

  const redirect = canonicalCardRedirect(
    context,
    config,
    leagueSlug,
    cardRouteId,
    card.name,
  );
  if (redirect) return redirect;

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
      { game, ...GAME_METADATA[game] },
      routeParam(context.params.league),
      routeParam(context.params.cardId),
    );
    if (response.status < 300 || response.status >= 400) {
      context.waitUntil(cache.put(cacheKey, response.clone()));
    }
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
