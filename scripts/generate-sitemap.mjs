import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
const CARDS_DATA_DIR = path.join(
  ROOT_DIR,
  "node_modules/@navali/poe1-divination-cards/data",
);

const GAME_CONFIG = {
  poe1: {
    label: "PoE 1",
    seoLabel: "Path of Exile",
    slug: "path-of-exile",
  },
  poe2: {
    label: "PoE 2",
    seoLabel: "Path of Exile 2",
    slug: "path-of-exile-2",
  },
};

function htmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function xmlEscape(value) {
  return htmlEscape(value).replace(/&#39;/g, "&apos;");
}

function safeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function absoluteUrl(pathname) {
  return new URL(pathname, SITE_URL).href;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
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

function fallbackPage(body) {
  return `<main class="mx-auto w-full max-w-300 px-4 py-8 text-(--wc-text-70)">${body}</main>`;
}

function renderMetadata(metadata) {
  const canonicalUrl =
    metadata.canonical === false ? null : absoluteUrl(metadata.pathname);
  const imageUrl = metadata.imagePath ? absoluteUrl(metadata.imagePath) : null;
  const tags = [
    `<title data-seo-static>${htmlEscape(metadata.title)}</title>`,
    `<meta data-seo-static name="description" content="${htmlEscape(metadata.description)}">`,
    `<meta data-seo-static name="robots" content="${htmlEscape(metadata.robots ?? "index, follow")}">`,
    `<meta data-seo-static property="og:type" content="website">`,
    `<meta data-seo-static property="og:site_name" content="${SITE_NAME}">`,
    `<meta data-seo-static property="og:locale" content="en_US">`,
    `<meta data-seo-static property="og:title" content="${htmlEscape(metadata.title)}">`,
    `<meta data-seo-static property="og:description" content="${htmlEscape(metadata.description)}">`,
    `<meta data-seo-static name="twitter:card" content="${imageUrl ? "summary_large_image" : "summary"}">`,
    `<meta data-seo-static name="twitter:title" content="${htmlEscape(metadata.title)}">`,
    `<meta data-seo-static name="twitter:description" content="${htmlEscape(metadata.description)}">`,
  ];

  if (canonicalUrl) {
    tags.push(
      `<link data-seo-static rel="canonical" href="${htmlEscape(canonicalUrl)}">`,
      `<meta data-seo-static property="og:url" content="${htmlEscape(canonicalUrl)}">`,
    );
  }

  if (imageUrl) {
    tags.push(
      `<meta data-seo-static property="og:image" content="${htmlEscape(imageUrl)}">`,
      `<meta data-seo-static name="twitter:image" content="${htmlEscape(imageUrl)}">`,
    );
  }

  if (metadata.imageAlt) {
    tags.push(
      `<meta data-seo-static property="og:image:alt" content="${htmlEscape(metadata.imageAlt)}">`,
      `<meta data-seo-static name="twitter:image:alt" content="${htmlEscape(metadata.imageAlt)}">`,
    );
  }

  for (const structuredData of metadata.structuredData ?? []) {
    tags.push(
      `<script data-seo-static type="application/ld+json">${safeJsonLd(structuredData)}</script>`,
    );
  }

  if (metadata.seoPageFacts) {
    tags.push(
      `<script data-seo-page-facts type="application/json">${safeJsonLd({
        pathname: metadata.pathname,
        facts: metadata.seoPageFacts,
      })}</script>`,
    );
  }

  return tags.join("\n    ");
}

function renderDocument(template, metadata) {
  const withoutExistingSeo = template
    .replace(/\s*<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<[^>]+data-seo-static[^>]*>(?:[\s\S]*?<\/[^>]+>)?/gi, "");
  const withHead = withoutExistingSeo.replace(
    "</head>",
    `    ${renderMetadata(metadata)}\n  </head>`,
  );

  return withHead.replace(
    '<div id="root"></div>',
    `<div id="root">${metadata.body ?? ""}</div>`,
  );
}

async function writeRouteDocument(template, metadata) {
  const relativePath = `${metadata.pathname.replace(/^\//, "")}.html`;
  const outputPath = path.join(DIST_DIR, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderDocument(template, metadata));
}

async function loadLeagueCards(game, leagueName) {
  if (game !== "poe1") return [];

  const leagueFile = path.join(CARDS_DATA_DIR, `cards-${leagueName}.json`);
  const cardsFile = (await fileExists(leagueFile))
    ? leagueFile
    : path.join(CARDS_DATA_DIR, "cards.json");
  const cards = await readJson(cardsFile);
  return Array.isArray(cards) ? cards : [];
}

async function loadLeagueDropRates(league) {
  if (!league.url) return { cards: [] };

  const filePath = path.join(DIST_DIR, league.url.replace(/^\//, ""));
  return readJson(filePath);
}

function formatInteger(value) {
  return Number(value ?? 0).toLocaleString("en-US");
}

function renderCardList(cards) {
  if (cards.length === 0) {
    return "<p>Card data is not available for this game yet.</p>";
  }

  const items = cards
    .map(
      (card) =>
        `<li><strong>${htmlEscape(card.name)}</strong> — ${htmlEscape(card.description)}</li>`,
    )
    .join("");

  return `<ul>${items}</ul>`;
}

function renderDropRateTable(cards) {
  if (cards.length === 0) {
    return "<p>No community drop-rate observations are available yet.</p>";
  }

  const rows = cards
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
  const observedTotal = Number(
    league.observed_total ??
      dropRates.summary?.observed_total ??
      dropRates.observed_total ??
      0,
  );
  const robots =
    cards.length === 0 && dropRates.cards.length === 0
      ? "noindex, follow"
      : "index, follow";
  const seoPageFacts = {
    cardCount: cards.length,
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
        <p><strong>${formatInteger(cards.length)}</strong> cards are available in this league dataset.</p>
        ${renderCardList(cards)}
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
        <p>Browse rewards, stack sizes, card artwork, flavour text, and rarity information for this league.</p>
        <p><a href="${htmlEscape(`${leaguePath}/cards`)}">Browse ${formatInteger(cards.length)} divination cards</a></p>
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
    `/cards/* /path-of-exile/${poe1Default}/cards/:splat 308`,
    `/stacked-decks /path-of-exile/${poe1Default}/stacked-decks 308`,
    `/path-of-exile /path-of-exile/${poe1Default} 308`,
    `/path-of-exile-2 /path-of-exile-2/${poe2Default} 308`,
  ];

  for (const entry of entries) {
    if (entry.pathname !== "/") {
      redirects.push(`${entry.pathname}/ ${entry.pathname} 308`);
    }
  }

  redirects.push(
    "",
    "# Card details are intentionally still client-rendered while that page is under development.",
    "/path-of-exile/:league/cards/:cardId /index.html 200",
    "/path-of-exile-2/:league/cards/:cardId /index.html 200",
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

  for (const [game, gameConfig] of Object.entries(GAME_CONFIG)) {
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
    defaultLeagueByGame[game] = slugify(defaultLeague.name);

    for (const league of leagues) {
      const leagueSlug = slugify(league.name);
      const [cards, dropRates] = await Promise.all([
        loadLeagueCards(game, league.name),
        loadLeagueDropRates(league),
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
    }
  }

  entries.push(...staticPageMetadata(privacyMarkdown, attributionsMarkdown));

  for (const entry of entries) {
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
  const rootDocument = renderDocument(template, rootMetadata);
  await writeFile(templatePath, rootDocument);

  const notFoundDocument = renderDocument(template, {
    pathname: "/404",
    title: `Page Not Found | ${SITE_NAME}`,
    description: "The requested wraeclast.cards page could not be found.",
    robots: "noindex, nofollow",
    canonical: false,
    body: fallbackPage(
      '<article class="prose text-center"><h1>404 — Page not found</h1><p>The page you requested does not exist or has moved.</p><p><a href="/">Return to wraeclast.cards</a></p></article>',
    ),
  });
  await writeFile(path.join(DIST_DIR, "404.html"), notFoundDocument);

  const sitemapEntries = [rootMetadata, ...entries];
  const { indexedCount, sitemapCount } = await writeSitemaps(sitemapEntries);
  await writeFile(
    path.join(DIST_DIR, "_redirects"),
    buildRedirects(entries, defaultLeagueByGame),
  );

  console.log(
    `[seo] Wrote ${entries.length + 1} static pages and ${indexedCount} sitemap URLs across ${sitemapCount} sitemap file(s) to ${DIST_DIR}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
