import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { createCard } from "../src/features/cards/api/getCards.utils.ts";
import {
  DIVINATION_CARD_RARITY_LABELS,
  divinationCardSlug,
  getDivinationCardsDataSource,
  parseDivinationCards,
} from "../src/lib/divinationCards.ts";
import { normalizeLeagueDropRates } from "../src/lib/dropRates/normalizers.ts";
import { GAME_METADATA } from "../src/lib/gameSlug.ts";
import { leagueNameToSlug } from "../src/lib/leagueSlug.ts";
import {
  htmlEscape,
  renderNonHydratedSeoDocument,
  renderSeoDocument,
} from "../src/lib/seoDocument.ts";
import {
  createCardSeoMetadata,
  createLeagueSeoMetadata,
  createRootSeoMetadata,
  createStaticPageSeoMetadata,
  SITE_NAME,
} from "../src/lib/seoMetadata.ts";

const SITE_URL = (process.env.SITE_URL ?? "https://wraeclast.cards").replace(
  /\/+$/,
  "",
);
const ROOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const DIST_DIR = path.join(ROOT_DIR, "dist");
const TEMPLATE_CACHE_PATH = path.join(ROOT_DIR, ".tanstack/seo-template.html");
const VITE_MANIFEST_PATH = path.join(DIST_DIR, ".vite/manifest.json");
const MAX_URLS_PER_SITEMAP = 50_000;
// Leave room for future generated routes without ever crossing Google's limit.
const SITEMAP_CHUNK_SIZE = 45_000;
const FETCH_TIMEOUT_MS = 15_000;
const CARDS_DATA_DIR = path.join(
  ROOT_DIR,
  "node_modules/@navali/poe1-divination-cards/data",
);
const cardCatalogCache = new Map();

function xmlEscape(value) {
  return htmlEscape(value).replace(/&#39;/g, "&apos;");
}

function absoluteUrl(pathname) {
  return new URL(pathname, SITE_URL).href;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readUrlJson(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`GET ${url} failed with ${response.status}`);
  }
  return response.json();
}

async function fileExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function loadBuildTemplate() {
  const outputPath = path.join(DIST_DIR, "index.html");
  const output = await readFile(outputPath, "utf8");

  // Vite's fresh document has no generated SEO tags. Cache that pristine
  // version because production regenerates static pages after refreshing data.
  if (!output.includes("data-seo-static")) {
    await mkdir(path.dirname(TEMPLATE_CACHE_PATH), { recursive: true });
    await writeFile(TEMPLATE_CACHE_PATH, output);
    return output;
  }

  if (await fileExists(TEMPLATE_CACHE_PATH)) {
    return readFile(TEMPLATE_CACHE_PATH, "utf8");
  }

  throw new Error(
    "The generated index.html cannot be reused as an SEO template. Run the Vite build before regenerating the sitemap.",
  );
}

async function writeRouteDocument(template, metadata) {
  const relativePath = `${metadata.pathname.replace(/^\//, "")}.html`;
  const outputPath = path.join(DIST_DIR, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderSeoDocument(template, metadata, SITE_URL));
}

async function includeBuildStyles(template) {
  const manifest = await readJson(VITE_MANIFEST_PATH);
  const cssFiles = new Set(
    Object.values(manifest).flatMap((entry) => entry.css ?? []),
  );
  if (cssFiles.size === 0) {
    throw new Error("The Vite manifest does not contain any stylesheet assets");
  }
  const links = [...cssFiles]
    .filter((file) => !template.includes(`href="/${file}"`))
    .map(
      (file) =>
        `<link rel="stylesheet" crossorigin href="/${htmlEscape(file)}">`,
    )
    .join("\n    ");

  return links
    ? template.replace(
        "<!--wraeclast-seo-head-->",
        `${links}\n    <!--wraeclast-seo-head-->`,
      )
    : template;
}

function validatePrerenderedBody(entry, body) {
  if (!body.includes("self.$_TSR") || !body.includes('class="$tsr"')) {
    throw new Error(
      `Prerendered route ${entry.pathname} is missing its hydration payload`,
    );
  }
  if (body.includes('<article class="prose max-w-none">')) {
    throw new Error(
      `Prerendered route ${entry.pathname} still contains the legacy SEO fallback`,
    );
  }

  const expectedName = entry.seoPageFacts?.name;
  if (expectedName && !body.includes(expectedName)) {
    throw new Error(
      `Prerendered card route ${entry.pathname} is missing ${expectedName}`,
    );
  }
}

async function prerenderRouteBodies(entries, dropRatesIndex, gameDropRates) {
  const vite = await createServer({
    root: ROOT_DIR,
    mode: "production",
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  try {
    const { renderStaticRoute } = await vite.ssrLoadModule(
      "/src/ssg/renderStaticRoute.tsx",
    );

    const queue = entries.values();
    const workerCount = Math.min(
      entries.length,
      Math.max(1, Number(process.env.PRERENDER_CONCURRENCY) || 8),
    );
    await Promise.all(
      Array.from({ length: workerCount }, async () => {
        for (const entry of queue) {
          const body = await renderStaticRoute({
            pathname: entry.pathname,
            dropRatesIndex,
            gameDropRates,
            prerenderData: entry.prerenderData,
          });
          validatePrerenderedBody(entry, body);
          entry.body = body;
        }
      }),
    );
  } finally {
    await vite.close();
  }
}

async function loadLeagueCards(game, league, legacyCardDataUrl) {
  if (game !== "poe1") return [];

  const cardDataUrl =
    league.reference_source_url ??
    (league.historical ? legacyCardDataUrl : undefined);
  const source = getDivinationCardsDataSource(game, cardDataUrl, {
    allowDefaultSource: !league.historical,
  });
  if (!source) {
    if (cardDataUrl !== undefined) {
      throw new Error(
        `Unsupported card data source for ${game}/${league.name}`,
      );
    }
    return [];
  }

  let cardsPromise = cardCatalogCache.get(source.dataUrl);
  if (!cardsPromise) {
    cardsPromise = (async () => {
      const value =
        cardDataUrl === undefined
          ? await readJson(path.join(CARDS_DATA_DIR, "cards.json"))
          : await readUrlJson(source.dataUrl);
      return parseDivinationCards(value).map((raw) => createCard(raw, source));
    })();
    cardCatalogCache.set(source.dataUrl, cardsPromise);
  }

  return cardsPromise;
}

async function loadLeagueDropRates(game, league) {
  if (!league.url) return { cards: [] };

  const filePath = path.join(DIST_DIR, league.url.replace(/^\//, ""));
  return normalizeLeagueDropRates(await readJson(filePath), game);
}

function cardSitemapCandidates(cards, observedCards) {
  const cardsBySlug = new Map();

  for (const card of cards) {
    cardsBySlug.set(card.id, { card });
  }
  for (const observedCard of observedCards) {
    const slug = divinationCardSlug(observedCard.name);
    cardsBySlug.set(slug, {
      ...cardsBySlug.get(slug),
      observedCard,
    });
  }

  return cardsBySlug.values();
}

function cardPageMetadata({
  game,
  gameConfig,
  league,
  leagueSlug,
  card,
  observedCard,
  cards,
  dropRates,
}) {
  const facts = card
    ? {
        name: card.name,
        slug: card.id,
        rewardText: card.rewardText,
        stackSize: card.stackSize,
        fromBoss: card.fromBoss,
        rarity: DIVINATION_CARD_RARITY_LABELS[card.rarity],
        imageUrl: card.imageUrl,
        observedCount: observedCard?.count,
        observedRate: observedCard?.ratio,
      }
    : {
        name: observedCard.name,
        slug: divinationCardSlug(observedCard.name),
        observedCount: observedCard.count,
        observedRate: observedCard.ratio,
      };

  return {
    ...createCardSeoMetadata({
      gameLabel: gameConfig.label,
      gameSeoLabel: gameConfig.seoLabel,
      gameSlug: gameConfig.slug,
      leagueName: league.name,
      leagueSlug,
      facts,
      siteUrl: SITE_URL,
    }),
    seoPageFacts: facts,
    lastmod: league.generated_at || dropRates.generated_at || null,
    prerenderData: {
      game,
      league,
      cards,
      dropRates,
      compactQueryState: true,
    },
  };
}

function leaguePageMetadata({
  game,
  gameConfig,
  league,
  leagueSlug,
  cards,
  dropRates,
  page,
}) {
  const observedCards = dropRates.cards.filter(
    (card) => Number(card.count) > 0,
  );
  const representedCardCount = cards.length || observedCards.length;
  const observedTotal = Number(league.observed_total ?? 0);
  const robots =
    cards.length === 0 && dropRates.cards.length === 0
      ? "noindex, follow"
      : "index, follow";
  const seoPageFacts = {
    cardCount: representedCardCount,
    observedTotal,
    generatedAt: league.generated_at || dropRates.generated_at || undefined,
    dataPath: league.url || undefined,
  };
  const sharedMetadata = createLeagueSeoMetadata({
    gameLabel: gameConfig.label,
    gameSeoLabel: gameConfig.seoLabel,
    gameSlug: gameConfig.slug,
    leagueName: league.name,
    leagueSlug,
    page,
    robots,
    facts: seoPageFacts,
    siteUrl: SITE_URL,
  });

  return {
    ...sharedMetadata,
    seoPageFacts,
    lastmod: league.generated_at || dropRates.generated_at || null,
    prerenderData: { game, league, cards, dropRates },
  };
}

function staticPageMetadata() {
  return [
    createStaticPageSeoMetadata("soothsayer", SITE_URL),
    createStaticPageSeoMetadata("privacy", SITE_URL),
    createStaticPageSeoMetadata("attributions", SITE_URL),
    createStaticPageSeoMetadata("downloads", SITE_URL),
    createStaticPageSeoMetadata("auth", SITE_URL),
  ];
}

function buildSitemapXml(entries) {
  const urls = entries
    .map((entry) => {
      const lines = [
        "  <url>",
        `    <loc>${xmlEscape(absoluteUrl(entry.pathname))}</loc>`,
      ];
      if (entry.lastmod) {
        lines.push(`    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`);
      }
      lines.push("  </url>");
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildSitemapIndexXml(sitemaps) {
  const items = sitemaps
    .map(({ filename, lastmod }) => {
      const lines = [
        "  <sitemap>",
        `    <loc>${xmlEscape(absoluteUrl(`/${filename}`))}</loc>`,
      ];
      if (lastmod) {
        lines.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
      }
      lines.push("  </sitemap>");
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

function latestLastmod(entries) {
  return entries.reduce((latest, entry) => {
    if (!entry.lastmod) return latest;
    return !latest || entry.lastmod > latest ? entry.lastmod : latest;
  }, null);
}

async function writeSitemaps(entries) {
  const indexedEntries = entries.filter(
    (entry) => (entry.robots ?? "index, follow") === "index, follow",
  );

  if (indexedEntries.length <= MAX_URLS_PER_SITEMAP) {
    await writeFile(
      path.join(DIST_DIR, "sitemap.xml"),
      buildSitemapXml(indexedEntries),
    );
    return { indexedCount: indexedEntries.length, sitemapCount: 1 };
  }

  const sitemaps = [];
  for (
    let offset = 0;
    offset < indexedEntries.length;
    offset += SITEMAP_CHUNK_SIZE
  ) {
    const chunk = indexedEntries.slice(offset, offset + SITEMAP_CHUNK_SIZE);
    const sequence = String(sitemaps.length + 1).padStart(3, "0");
    const filename = `sitemap-${sequence}.xml`;
    await writeFile(path.join(DIST_DIR, filename), buildSitemapXml(chunk));
    sitemaps.push({ filename, lastmod: latestLastmod(chunk) });
  }

  await writeFile(
    path.join(DIST_DIR, "sitemap.xml"),
    buildSitemapIndexXml(sitemaps),
  );
  return { indexedCount: indexedEntries.length, sitemapCount: sitemaps.length };
}

function buildRedirects(entries, defaultLeagueByGame) {
  const poe1Default = defaultLeagueByGame.poe1 ?? "standard";
  const poe2Default = defaultLeagueByGame.poe2 ?? "standard";
  const redirects = [
    `/cards /path-of-exile/${poe1Default}/cards 308`,
    `/stacked-decks /path-of-exile/${poe1Default}/stacked-decks 308`,
    `/path-of-exile /path-of-exile/${poe1Default} 308`,
    `/path-of-exile-2 /path-of-exile-2/${poe2Default} 308`,
  ];

  for (const entry of entries) {
    const isCardDetails = /^\/path-of-exile(?:-2)?\/[^/]+\/cards\/[^/]+$/.test(
      entry.pathname,
    );
    if (entry.pathname !== "/" && !isCardDetails) {
      redirects.push(`${entry.pathname}/ ${entry.pathname} 308`);
    }
  }

  redirects.push(
    `/cards/* /path-of-exile/${poe1Default}/cards/:splat 308`,
    "/path-of-exile/:league/cards/:cardId/ /path-of-exile/:league/cards/:cardId 308",
    "/path-of-exile-2/:league/cards/:cardId/ /path-of-exile-2/:league/cards/:cardId 308",
  );

  return `${redirects.join("\n")}\n`;
}

async function main() {
  const templatePath = path.join(DIST_DIR, "index.html");
  const template = await includeBuildStyles(await loadBuildTemplate());
  const dropRatesIndex = await readJson(
    path.join(DIST_DIR, "data/drop-rates/index.json"),
  );
  const entries = [];
  const defaultLeagueByGame = {};
  const gameDropRates = {};
  let rootPrerenderData;
  let cardPageCount = 0;

  for (const game of Object.keys(GAME_METADATA)) {
    const gameIndexPath = path.join(
      DIST_DIR,
      `data/drop-rates/${game}/index.json`,
    );
    if (await fileExists(gameIndexPath)) {
      gameDropRates[game] = await readJson(gameIndexPath);
    }
  }

  for (const [game, gameConfig] of Object.entries(GAME_METADATA)) {
    const publishedLeagues = dropRatesIndex.games[game]?.leagues ?? [];
    const leagues =
      publishedLeagues.length > 0
        ? publishedLeagues
        : [
            {
              id: "standard",
              name: "Standard",
              historical: false,
              url: "",
              card_count: 0,
              generated_at: "",
            },
          ];
    const defaultLeague =
      leagues.find((league) => !league.historical) ?? leagues[0];
    defaultLeagueByGame[game] = leagueNameToSlug(defaultLeague.name);

    for (const league of leagues) {
      const leagueSlug = leagueNameToSlug(league.name);
      const dropRates = await loadLeagueDropRates(game, league);
      const cards = await loadLeagueCards(
        game,
        league,
        dropRates.reference?.source_url,
      );
      const prerenderData = { game, league, cards, dropRates };
      if (game === "poe1" && league.id === defaultLeague.id) {
        rootPrerenderData = prerenderData;
      }

      for (const page of ["home", "cards", "stacked-decks"]) {
        entries.push(
          leaguePageMetadata({
            game,
            gameConfig,
            league,
            leagueSlug,
            cards,
            dropRates,
            page,
          }),
        );
      }

      for (const { card, observedCard } of cardSitemapCandidates(
        cards,
        dropRates.cards,
      )) {
        entries.push(
          cardPageMetadata({
            game,
            gameConfig,
            league,
            leagueSlug,
            card,
            observedCard,
            cards,
            dropRates,
          }),
        );
        cardPageCount += 1;
      }
    }
  }

  entries.push(...staticPageMetadata());

  const rootMetadata = {
    ...createRootSeoMetadata(SITE_URL),
    prerenderData: rootPrerenderData,
  };
  const notFoundMetadata = {
    pathname: "/404",
    title: `Page Not Found | ${SITE_NAME}`,
    description: "The requested wraeclast.cards page could not be found.",
    robots: "noindex, nofollow",
    canonical: false,
  };
  await prerenderRouteBodies(
    [rootMetadata, notFoundMetadata, ...entries],
    dropRatesIndex,
    gameDropRates,
  );

  for (const entry of entries) {
    await writeRouteDocument(template, entry);
  }

  const rootDocument = renderSeoDocument(template, rootMetadata, SITE_URL);
  await writeFile(templatePath, rootDocument);

  const notFoundDocument = renderNonHydratedSeoDocument(
    template,
    notFoundMetadata,
    SITE_URL,
  );
  await writeFile(path.join(DIST_DIR, "404.html"), notFoundDocument);

  const sitemapEntries = [rootMetadata, ...entries];
  const { indexedCount, sitemapCount } = await writeSitemaps(sitemapEntries);
  await writeFile(
    path.join(DIST_DIR, "_redirects"),
    buildRedirects(entries, defaultLeagueByGame),
  );

  console.log(
    `[seo] Wrote ${entries.length + 1} static pages (${cardPageCount} card pages) and ${indexedCount} sitemap URLs across ${sitemapCount} sitemap file(s) to ${DIST_DIR}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
