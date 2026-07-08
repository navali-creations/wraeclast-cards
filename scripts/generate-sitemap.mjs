import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const DEFAULT_SITE_URL = "https://wraeclast.cards";
const ROOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const POE1_CARDS_DATA_DIR = path.join(
  ROOT_DIR,
  "node_modules/@navali/poe1-divination-cards/data",
);
const PRIVATE_PATH_SEGMENTS = new Set(["auth"]);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTrailingSlash(fullPath) {
  if (fullPath === "/") return "/";
  return fullPath.replace(/\/+$/, "");
}

function isDynamicRoute(fullPath) {
  return fullPath.split("/").some((segment) => segment.startsWith("$"));
}

function isPrivateRoute(fullPath) {
  return fullPath
    .split("/")
    .some((segment) => PRIVATE_PATH_SEGMENTS.has(segment));
}

async function loadStaticRoutePaths() {
  const server = await createServer({
    root: ROOT_DIR,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "warn",
  });

  try {
    const { routeTree } = await server.ssrLoadModule("/src/routeTree.gen.ts");
    const { createRouter } = await import("@tanstack/react-router");
    const router = createRouter({ routeTree, isServer: true });

    const paths = new Set();
    for (const route of Object.values(router.routesById)) {
      const fullPath = route.fullPath;
      if (typeof fullPath !== "string") continue;
      if (isDynamicRoute(fullPath)) continue;
      if (isPrivateRoute(fullPath)) continue;
      paths.add(normalizeTrailingSlash(fullPath));
    }

    return paths;
  } finally {
    await server.close();
  }
}

async function loadUniquePoe1CardNames() {
  const entries = await readdir(POE1_CARDS_DATA_DIR);
  const leagueFiles = entries
    .filter((name) => /^cards-.+\.json$/.test(name))
    .sort();

  if (leagueFiles.length === 0) {
    throw new Error(`No cards-*.json files found in ${POE1_CARDS_DATA_DIR}`);
  }

  const names = new Set();
  for (const file of leagueFiles) {
    const filePath = path.join(POE1_CARDS_DATA_DIR, file);
    const cards = JSON.parse(await readFile(filePath, "utf8"));
    if (!Array.isArray(cards)) {
      throw new Error(`Expected an array of cards in ${filePath}`);
    }

    for (const card of cards) {
      if (!card || typeof card.name !== "string" || !card.name) {
        throw new Error(`Invalid card entry in ${filePath}`);
      }
      names.add(card.name);
    }
  }

  return names;
}

function buildCardSlugMap(cardNames) {
  const slugToName = new Map();
  for (const name of cardNames) {
    const slug = slugify(name);
    const existingName = slugToName.get(slug);
    if (existingName && existingName !== name) {
      throw new Error(
        `Slug collision: "${existingName}" and "${name}" both produce slug "${slug}"`,
      );
    }
    slugToName.set(slug, name);
  }
  return slugToName;
}

async function loadDropRatesGeneratedAt(distDir) {
  try {
    const raw = await readFile(
      path.join(distDir, "data", "drop-rates", "index.json"),
      "utf8",
    );
    const parsed = JSON.parse(raw);
    return typeof parsed.generated_at === "string" ? parsed.generated_at : null;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

function xmlEscape(value) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return char;
    }
  });
}

function buildSitemapXml(entries) {
  const urls = entries
    .map(({ loc, lastmod }) => {
      const lines = [`  <url>`, `    <loc>${xmlEscape(loc)}</loc>`];
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      lines.push(`  </url>`);
      return lines.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  const siteUrl = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/+$/,
    "",
  );
  const distDir = path.join(ROOT_DIR, "dist");
  const outputPath = path.join(distDir, "sitemap.xml");

  const staticPaths = await loadStaticRoutePaths();
  const dropRatesGeneratedAt = await loadDropRatesGeneratedAt(distDir);
  const cardNames = await loadUniquePoe1CardNames();
  const slugToName = buildCardSlugMap(cardNames);

  const entries = [];
  const seenLocs = new Set();

  function addEntry(pathname, lastmod) {
    const loc = `${siteUrl}${pathname}`;
    if (seenLocs.has(loc)) return;
    seenLocs.add(loc);
    entries.push({ loc, lastmod: lastmod ?? null });
  }

  for (const pathname of staticPaths) {
    // Only /stacked-decks renders generated drop-rate data today, so it is
    // the only static page with a truthful <lastmod>.
    const lastmod = pathname === "/stacked-decks" ? dropRatesGeneratedAt : null;
    addEntry(pathname, lastmod);
  }

  for (const slug of slugToName.keys()) {
    addEntry(`/path-of-exile/cards/${slug}`, null);
  }

  entries.sort((a, b) => a.loc.localeCompare(b.loc));

  await mkdir(distDir, { recursive: true });
  await writeFile(outputPath, buildSitemapXml(entries));

  console.log(`[sitemap] Wrote ${entries.length} URLs to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
