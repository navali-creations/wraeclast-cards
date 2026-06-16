import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_GAMES = ["poe1", "poe2"];
const DEFAULT_OUTPUT_DIR = "dist/data/drop-rates";
const DEFAULT_PUBLIC_BASE_URL = "https://wraeclast.cards/data/drop-rates";
const CACHE_SECONDS = 7 * 24 * 60 * 60;
const BROWSER_CACHE_SECONDS = 60 * 60;

function parseArgs(argv) {
  const args = {
    noHeaders: false,
    outputDir: null,
    publicBaseUrl: null,
    backfillHistorical: null,
  };

  for (const arg of argv) {
    if (arg === "--no-headers") {
      args.noHeaders = true;
      continue;
    }

    if (arg === "--backfill-historical") {
      args.backfillHistorical = true;
      continue;
    }

    const [name, ...valueParts] = arg.split("=");
    const value = valueParts.join("=");

    if (name === "--output-dir" && value) {
      args.outputDir = value;
      continue;
    }

    if (name === "--public-base-url" && value) {
      args.publicBaseUrl = value;
    }
  }

  return args;
}

function parseEnvFile(content) {
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    process.env[key] = rawValue
      .trim()
      .replace(/^['"]|['"]$/g, "")
      .replace(/\\n/g, "\n");
  }
}

async function loadLocalEnv() {
  try {
    parseEnvFile(await readFile(".env", "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseBoolean(value) {
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, "");
}

function jsonStringify(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`GET ${url} failed with ${response.status}`);
  }

  return response.json();
}

async function fetchOptionalJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
  } catch {
    console.warn(`[drop-rates] Could not fetch previous manifest from ${url}`);
    return null;
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    console.warn(
      `[drop-rates] Could not fetch previous data from ${url}: ${response.status}`,
    );
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    console.warn(`[drop-rates] No previous JSON manifest found at ${url}`);
    return null;
  }

  try {
    return await response.json();
  } catch {
    console.warn(`[drop-rates] Previous manifest at ${url} is not valid JSON`);
    return null;
  }
}

function validateDropRatePayload(game, payload) {
  if (!payload || payload.game !== game) {
    throw new Error(`Unexpected drop-rate payload for ${game}`);
  }

  if (!Array.isArray(payload.leagues) || !Array.isArray(payload.cards)) {
    throw new Error(`Invalid drop-rate payload shape for ${game}`);
  }
}

async function fetchDropRates({ supabaseUrl, apiKey, game, includeInactive }) {
  const url = new URL(
    `${normalizeBaseUrl(supabaseUrl)}/functions/v1/get-community-drop-rates`,
  );
  url.searchParams.set("game", game);

  if (includeInactive) {
    url.searchParams.set("include_inactive", "true");
  }

  const payload = await fetchJson(url.toString(), {
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  validateDropRatePayload(game, payload);
  return payload;
}

function splitCardsByLeague(payload) {
  const leagueIds = new Set(payload.leagues.map((league) => league.id));
  const byLeague = new Map(
    payload.leagues.map((league) => [
      league.id,
      {
        league,
        cards: [],
      },
    ]),
  );

  for (const card of payload.cards) {
    for (const [leagueId, stats] of Object.entries(card.leagues ?? {})) {
      if (!leagueIds.has(leagueId)) continue;

      byLeague.get(leagueId)?.cards.push({
        name: card.name,
        count: stats.count,
        ratio: stats.ratio,
        contributors: stats.contributors,
        verified_count: stats.verified_count,
        verified_contributors: stats.verified_contributors,
      });
    }
  }

  for (const leagueData of byLeague.values()) {
    leagueData.cards.sort((a, b) => a.name.localeCompare(b.name));
  }

  return byLeague;
}

function leagueFilePath(outputDir, game, leagueId) {
  return path.join(outputDir, game, `${leagueId}.json`);
}

function leagueUrl(game, leagueId) {
  return `/data/drop-rates/${game}/${leagueId}.json`;
}

function gameIndexUrl(game) {
  return `/data/drop-rates/${game}/index.json`;
}

async function writeLeagueFile({
  outputDir,
  generatedAt,
  game,
  league,
  cards,
  historical,
}) {
  const body = {
    schema_version: 1,
    generated_at: generatedAt,
    game,
    league: {
      id: league.id,
      name: league.name,
      historical,
    },
    cards,
  };

  const target = leagueFilePath(outputDir, game, league.id);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, jsonStringify(body));

  return {
    id: league.id,
    name: league.name,
    historical,
    url: leagueUrl(game, league.id),
    card_count: cards.length,
    generated_at: generatedAt,
  };
}

async function preservePreviousLeague({
  outputDir,
  publicBaseUrl,
  previousLeague,
  game,
}) {
  if (!previousLeague?.id || !previousLeague?.url) return null;

  const previousUrl = new URL(
    previousLeague.url,
    `${publicBaseUrl}/`,
  ).toString();
  const response = await fetch(previousUrl, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    console.warn(
      `[drop-rates] Could not preserve ${game}/${previousLeague.id}: ${response.status}`,
    );
    return null;
  }

  const body = await response.text();
  const target = leagueFilePath(outputDir, game, previousLeague.id);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, body.endsWith("\n") ? body : `${body}\n`);

  return {
    ...previousLeague,
    historical: true,
    url: leagueUrl(game, previousLeague.id),
  };
}

async function writeGameIndex({ outputDir, generatedAt, game, leagues }) {
  const body = {
    schema_version: 1,
    generated_at: generatedAt,
    game,
    leagues,
  };

  const target = path.join(outputDir, game, "index.json");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, jsonStringify(body));
}

async function writeRootIndex({ outputDir, generatedAt, games }) {
  const body = {
    schema_version: 1,
    generated_at: generatedAt,
    games,
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.json"), jsonStringify(body));
}

async function writeHeaders(distDir) {
  const headersPath = path.join(distDir, "_headers");
  const block = [
    "/data/drop-rates/*",
    "  Access-Control-Allow-Origin: *",
    `  Cache-Control: public, max-age=${BROWSER_CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
    "",
  ].join("\n");

  let existing = "";
  try {
    existing = await readFile(headersPath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const marker = "# Generated drop-rate data headers";
  const next = existing.includes(marker)
    ? existing.replace(
        new RegExp(`${marker}[\\s\\S]*?(?=\\n# |$)`),
        `${marker}\n${block}`,
      )
    : `${existing.trimEnd()}\n\n${marker}\n${block}`.trimStart();

  await writeFile(headersPath, next.endsWith("\n") ? next : `${next}\n`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await loadLocalEnv();

  const supabaseUrl = requiredEnv("SUPABASE_URL");
  const apiKey = requiredEnv("WRAECLAST_CARDS_API_KEY");
  const outputDir = path.resolve(
    args.outputDir ?? process.env.DROP_RATES_OUTPUT_DIR ?? DEFAULT_OUTPUT_DIR,
  );
  const distDir = path.resolve(outputDir, "../..");
  const publicBaseUrl = normalizeBaseUrl(
    args.publicBaseUrl ??
      process.env.DROP_RATES_PUBLIC_BASE_URL ??
      DEFAULT_PUBLIC_BASE_URL,
  );
  const games = (process.env.DROP_RATES_GAMES ?? DEFAULT_GAMES.join(","))
    .split(",")
    .map((game) => game.trim())
    .filter(Boolean);
  const forceBackfill =
    args.backfillHistorical ||
    parseBoolean(process.env.DROP_RATES_BACKFILL_HISTORICAL);
  const generatedAt = new Date().toISOString();

  const previousManifest = await fetchOptionalJson(
    `${publicBaseUrl}/index.json`,
  );
  const shouldBackfill = forceBackfill || !previousManifest;
  const rootGames = {};

  for (const game of games) {
    console.log(`[drop-rates] Fetching active ${game} data`);
    const activePayload = await fetchDropRates({
      supabaseUrl,
      apiKey,
      game,
      includeInactive: false,
    });

    const generatedLeagueIds = new Set();
    const leagueEntries = [];
    const activeByLeague = splitCardsByLeague(activePayload);

    for (const { league, cards } of activeByLeague.values()) {
      if (cards.length === 0) continue;

      leagueEntries.push(
        await writeLeagueFile({
          outputDir,
          generatedAt,
          game,
          league,
          cards,
          historical: false,
        }),
      );
      generatedLeagueIds.add(league.id);
    }

    const previousLeagues =
      previousManifest?.games?.[game]?.leagues?.filter(Boolean) ?? [];

    if (shouldBackfill) {
      console.log(`[drop-rates] Backfilling missing historical ${game} data`);
      const allPayload = await fetchDropRates({
        supabaseUrl,
        apiKey,
        game,
        includeInactive: true,
      });
      const allByLeague = splitCardsByLeague(allPayload);

      for (const { league, cards } of allByLeague.values()) {
        if (generatedLeagueIds.has(league.id) || cards.length === 0) continue;

        leagueEntries.push(
          await writeLeagueFile({
            outputDir,
            generatedAt,
            game,
            league,
            cards,
            historical: true,
          }),
        );
        generatedLeagueIds.add(league.id);
      }
    }

    for (const previousLeague of previousLeagues) {
      if (generatedLeagueIds.has(previousLeague.id)) continue;
      if ((previousLeague.card_count ?? 1) <= 0) continue;

      const preserved = await preservePreviousLeague({
        outputDir,
        publicBaseUrl,
        previousLeague,
        game,
      });

      if (preserved) {
        leagueEntries.push(preserved);
        generatedLeagueIds.add(preserved.id);
      }
    }

    leagueEntries.sort((a, b) => a.name.localeCompare(b.name));
    await writeGameIndex({
      outputDir,
      generatedAt,
      game,
      leagues: leagueEntries,
    });

    rootGames[game] = {
      url: gameIndexUrl(game),
      league_count: leagueEntries.length,
      leagues: leagueEntries,
    };
  }

  await writeRootIndex({ outputDir, generatedAt, games: rootGames });
  if (!args.noHeaders) {
    await writeHeaders(distDir);
  }

  console.log(`[drop-rates] Wrote static data to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
