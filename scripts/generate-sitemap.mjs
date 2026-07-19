import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  divinationCardRewardText,
  divinationCardSlug,
  getDivinationCardsDataSource,
  parseDivinationCards,
} from "../src/lib/divinationCards.ts";
import { normalizeLeagueDropRates } from "../src/lib/dropRates/normalizers.ts";
import { GAME_METADATA } from "../src/lib/gameSlug.ts";
import { leagueNameToSlug } from "../src/lib/leagueSlug.ts";
import {
  fallbackPage,
  htmlEscape,
  renderSeoDocument,
} from "../src/lib/seoDocument.ts";
import {
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
const MAX_URLS_PER_SITEMAP = 50_000;
// Leave room for future generated routes without ever crossing Google's limit.
const SITEMAP_CHUNK_SIZE = 45_000;
const FETCH_TIMEOUT_MS = 15_000;
const CARDS_DATA_DIR = path.join(
  ROOT_DIR,
  "node_modules/@navali/poe1-divination-cards/data",
);

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

async function loadLeagueCards(game, league) {
  if (game !== "poe1") return [];

  if (league.reference_source_url !== undefined) {
    const source = getDivinationCardsDataSource(
      game,
      league.reference_source_url,
      { allowDefaultSource: false },
    );
    if (!source) {
      throw new Error(
        `Unsupported card data source for ${game}/${league.name}`,
      );
    }

    return parseDivinationCards(await readUrlJson(source.dataUrl));
  }

  if (league.historical) return [];

  const cardsFile = path.join(CARDS_DATA_DIR, "cards.json");
  return parseDivinationCards(await readJson(cardsFile));
}

async function loadLeagueDropRates(game, league) {
  if (!league.url) return { cards: [] };

  const filePath = path.join(DIST_DIR, league.url.replace(/^\//, ""));
  return normalizeLeagueDropRates(await readJson(filePath), game);
}

function formatInteger(value) {
  return Number(value ?? 0).toLocaleString("en-US");
}

function renderCardList(cards, cardsPath) {
  if (cards.length === 0) {
    return "<p>Card data is not available for this game yet.</p>";
  }

  const items = cards
    .map(
      (card) =>
        `<li><a href="${htmlEscape(`${cardsPath}/${divinationCardSlug(card.name)}`)}"><strong>${htmlEscape(card.name)}</strong></a> - ${htmlEscape(divinationCardRewardText(card))}</li>`,
    )
    .join("");

  return `<ul>${items}</ul>`;
}

function renderObservedCardList(cards, cardsPath) {
  if (cards.length === 0) {
    return "<p>No observed card data is available for this league.</p>";
  }

  const items = cards
    .map(
      (card) =>
        `<li><a href="${htmlEscape(`${cardsPath}/${divinationCardSlug(card.name)}`)}"><strong>${htmlEscape(card.name)}</strong></a> - ${formatInteger(card.count)} reported drops</li>`,
    )
    .join("");

  return `<ul>${items}</ul>`;
}

function cardSitemapEntry({ gameConfig, leagueSlug, card }) {
  return {
    pathname: `/${gameConfig.slug}/${leagueSlug}/cards/${divinationCardSlug(card.name)}`,
    dynamic: true,
  };
}

function cardSitemapCandidates(cards, observedCards) {
  const cardsBySlug = new Map();

  for (const card of [...cards, ...observedCards]) {
    cardsBySlug.set(divinationCardSlug(card.name), card);
  }

  return cardsBySlug.values();
}

function renderDropRateTable(cards) {
  const observedCards = cards.filter((card) => Number(card.count) > 0);
  if (observedCards.length === 0) {
    return "<p>No community drop-rate observations are available yet.</p>";
  }

  const rows = observedCards
    .slice()
    .sort((left, right) => right.count - left.count)
    .map(
      (card) => `<tr>
        <th scope="row">${htmlEscape(card.name)}</th>
        <td>${formatInteger(card.count)}</td>
        <td>${(Number(card.ratio) * 100).toFixed(6)}%</td>
      </tr>`,
    )
    .join("");

  return `<div class="overflow-x-auto"><table>
    <thead><tr><th>Card</th><th>Drops reported</th><th>Observed rate</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function renderDiscoveryLinks(entries) {
  const links = entries
    .filter(
      (entry) =>
        (entry.robots ?? "index, follow") === "index, follow" &&
        (/^\/path-of-exile(?:-2)?\/[^/]+$/.test(entry.pathname) ||
          ["/soothsayer", "/privacy-policy", "/attributions"].includes(
            entry.pathname,
          )),
    )
    .map(
      (entry) =>
        `<li><a href="${htmlEscape(entry.pathname)}">${htmlEscape(entry.title.replace(` | ${SITE_NAME}`, ""))}</a></li>`,
    )
    .join("");

  return `<section>
    <h2>Explore wraeclast.cards</h2>
    <ul>${links}</ul>
  </section>`;
}

function leaguePageMetadata({
  gameConfig,
  league,
  leagueSlug,
  cards,
  dropRates,
  page,
}) {
  const leaguePath = `/${gameConfig.slug}/${leagueSlug}`;
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

  if (page === "cards") {
    return {
      ...sharedMetadata,
      seoPageFacts,
      body: fallbackPage(`<article class="prose max-w-none">
        <h1>${htmlEscape(league.name)} ${htmlEscape(gameConfig.label)} Divination Cards</h1>
        <p>${htmlEscape(sharedMetadata.description)}</p>
        <p><strong>${formatInteger(representedCardCount)}</strong> cards are represented in this league dataset.</p>
        ${cards.length > 0 ? renderCardList(cards, `${leaguePath}/cards`) : renderObservedCardList(observedCards, `${leaguePath}/cards`)}
      </article>`),
    };
  }

  if (page === "stacked-decks") {
    return {
      ...sharedMetadata,
      seoPageFacts,
      lastmod: league.generated_at || dropRates.generated_at || null,
      body: fallbackPage(`<article class="prose max-w-none">
        <h1>${htmlEscape(league.name)} ${htmlEscape(gameConfig.label)} Stacked Deck Drop Rates</h1>
        <p>${htmlEscape(sharedMetadata.description)}</p>
        <h2>Methodology</h2>
        <p>Drop rates are aggregated from real stacked deck openings captured by the open-source Soothsayer desktop application. Reference estimates use the average-weight formula documented by @nerdyjoe in the Prohibited Library spreadsheet; its published weight values are not imported. Rates can vary by league.</p>
        ${renderDropRateTable(dropRates.cards)}
      </article>`),
    };
  }

  const topRates = dropRates.cards
    .filter((card) => Number(card.count) > 0)
    .slice()
    .sort((left, right) => right.count - left.count)
    .slice(0, 10);
  const topRateItems = topRates
    .map(
      (card) =>
        `<li>${htmlEscape(card.name)}: ${(Number(card.ratio) * 100).toFixed(4)}%</li>`,
    )
    .join("");

  return {
    ...sharedMetadata,
    seoPageFacts,
    lastmod: league.generated_at || dropRates.generated_at || null,
    body: fallbackPage(`<article class="prose max-w-none">
      <h1>${htmlEscape(gameConfig.seoLabel)}: ${htmlEscape(league.name)} Divination Card Data</h1>
      <p>${htmlEscape(sharedMetadata.description)}</p>
      <section>
        <h2>Divination card database</h2>
        <p>${cards.length > 0 ? "Browse rewards, stack sizes, card artwork, flavour text, and rarity information for this league." : "Browse divination cards with community observations from this archived league."}</p>
        <p><a href="${htmlEscape(`${leaguePath}/cards`)}">Browse ${formatInteger(representedCardCount)} divination cards</a></p>
      </section>
      <section>
        <h2>Observed stacked deck drop rates</h2>
        ${topRateItems ? `<ol>${topRateItems}</ol>` : "<p>No observations are available yet.</p>"}
        <p><a href="${htmlEscape(`${leaguePath}/stacked-decks`)}">View all stacked deck drop rates</a></p>
      </section>
      <section>
        <h2>Soothsayer desktop tracker</h2>
        <p>Track live stacked deck sessions, profit, card history, and rarity insights.</p>
        <p><a href="/soothsayer">Learn more about Soothsayer</a></p>
      </section>
    </article>`),
  };
}

function renderMarkdown(markdown) {
  return renderToStaticMarkup(
    createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, markdown),
  );
}

function staticPageMetadata(privacyMarkdown, attributionsMarkdown) {
  const soothsayer = createStaticPageSeoMetadata("soothsayer", SITE_URL);

  return [
    {
      ...soothsayer,
      body: fallbackPage(`<article class="prose max-w-none">
        <h1>Soothsayer</h1>
        <p>${htmlEscape(soothsayer.description)}</p>
        <img src="/images/soothsayer/stats.webp" alt="${htmlEscape("Soothsayer statistics screen showing stacked deck session charts and summary metrics.")}">
        <h2>Features</h2>
        <ul>
          <li>Real-time stacked deck session tracking</li>
          <li>Personal card history and statistics</li>
          <li>Economy-aware profit forecasting</li>
          <li>Rarity insights using community and reference data</li>
        </ul>
        <p><a href="https://github.com/navali-creations/soothsayer/releases/latest">Download Soothsayer</a></p>
        <p><a href="https://github.com/navali-creations/soothsayer">View the source code on GitHub</a></p>
      </article>`),
    },
    {
      ...createStaticPageSeoMetadata("privacy", SITE_URL),
      body: fallbackPage(
        `<article class="prose mx-auto">${renderMarkdown(privacyMarkdown)}</article>`,
      ),
    },
    {
      ...createStaticPageSeoMetadata("attributions", SITE_URL),
      body: fallbackPage(
        `<article class="prose mx-auto">${renderMarkdown(attributionsMarkdown)}</article>`,
      ),
    },
    {
      ...createStaticPageSeoMetadata("downloads", SITE_URL),
      body: fallbackPage(
        '<article class="prose"><h1>Downloads</h1><p>This page is still under construction.</p></article>',
      ),
    },
    {
      ...createStaticPageSeoMetadata("auth", SITE_URL),
      body: fallbackPage(
        '<article class="prose"><h1>Opening Soothsayer</h1><p>This page returns authorization to the Soothsayer desktop application.</p></article>',
      ),
    },
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
  const template = await loadBuildTemplate();
  const dropRatesIndex = await readJson(
    path.join(DIST_DIR, "data/drop-rates/index.json"),
  );
  const privacyMarkdown = await readFile(
    path.join(ROOT_DIR, "PRIVACY.md"),
    "utf8",
  );
  const attributionsMarkdown = await readFile(
    path.join(ROOT_DIR, "content/attributions.md"),
    "utf8",
  );
  const entries = [];
  const defaultLeagueByGame = {};

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
      const [cards, dropRates] = await Promise.all([
        loadLeagueCards(game, league),
        loadLeagueDropRates(game, league),
      ]);

      for (const page of ["home", "cards", "stacked-decks"]) {
        entries.push(
          leaguePageMetadata({
            gameConfig,
            league,
            leagueSlug,
            cards,
            dropRates,
            page,
          }),
        );
      }

      for (const card of cardSitemapCandidates(cards, dropRates.cards)) {
        entries.push(
          cardSitemapEntry({
            gameConfig,
            leagueSlug,
            card,
          }),
        );
      }
    }
  }

  entries.push(...staticPageMetadata(privacyMarkdown, attributionsMarkdown));

  const staticEntries = entries.filter((entry) => !entry.dynamic);
  for (const entry of staticEntries) {
    await writeRouteDocument(template, entry);
  }

  const poe1Default = defaultLeagueByGame.poe1 ?? "standard";
  const rootMetadata = {
    ...createRootSeoMetadata(SITE_URL),
    body: fallbackPage(`<article class="prose max-w-none">
      <h1>Path of Exile divination cards and stacked deck drop rates</h1>
      <p>The complete divination card reference for Path of Exile, with league-specific card data, community-observed stacked deck drop rates, and the open-source Soothsayer desktop tracker.</p>
      <section>
        <h2>Divination card database</h2>
        <p>Browse rewards, stack sizes, card artwork, flavour text, and rarity information for the current league.</p>
        <p><a href="/path-of-exile/${htmlEscape(poe1Default)}/cards">Browse divination cards</a></p>
      </section>
      <section>
        <h2>Observed stacked deck drop rates</h2>
        <p>Explore aggregated observations from real stacked deck openings captured by Soothsayer.</p>
        <p><a href="/path-of-exile/${htmlEscape(poe1Default)}/stacked-decks">View stacked deck drop rates</a></p>
      </section>
      <section>
        <h2>Soothsayer desktop tracker</h2>
        <p>Track live sessions, profit, personal card history, and rarity insights.</p>
        <p><a href="/soothsayer">Learn more about Soothsayer</a></p>
      </section>
      ${renderDiscoveryLinks(entries)}
    </article>`),
  };
  const rootDocument = renderSeoDocument(template, rootMetadata, SITE_URL);
  await writeFile(templatePath, rootDocument);

  const notFoundDocument = renderSeoDocument(
    template,
    {
      pathname: "/404",
      title: `Page Not Found | ${SITE_NAME}`,
      description: "The requested wraeclast.cards page could not be found.",
      robots: "noindex, nofollow",
      canonical: false,
      body: fallbackPage(
        '<article class="prose text-center"><h1>404 — Page not found</h1><p>The page you requested does not exist or has moved.</p><p><a href="/">Return to wraeclast.cards</a></p></article>',
      ),
    },
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
    `[seo] Wrote ${staticEntries.length + 1} static pages and ${indexedCount} sitemap URLs (${entries.length - staticEntries.length} dynamically rendered card pages) across ${sitemapCount} sitemap file(s) to ${DIST_DIR}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
