import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_GAMES = ["poe1", "poe2"];
const DEFAULT_OUTPUT_DIR = "dist/data/drop-rates";
const DEFAULT_PUBLIC_BASE_URL = "https://wraeclast.cards/data/drop-rates";
const DEFAULT_REFERENCE_DATA_BASE_URL =
  "https://raw.githubusercontent.com/navali-creations/fateweaver/main/packages/poe1-divination-cards/data";
const SCHEMA_VERSION = 4;
const CACHE_SECONDS = 7 * 24 * 60 * 60;
const BROWSER_CACHE_SECONDS = 60 * 60;
const LEAGUE_STAT_FIELDS = [
  "upload_count",
  "observed_total",
  "card_observed_total",
  "contributors",
  "verified_observed_total",
  "verified_card_observed_total",
  "verified_contributors",
  "excluded_suspicious_upload_count",
  "excluded_suspicious_observed_total",
  "unresolved_card_row_count",
  "unresolved_card_observed_total",
];

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

function parseOptionalBoolean(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  return parseBoolean(value);
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

async function fetchOptionalRawJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
  } catch {
    console.warn(`[drop-rates] Could not fetch optional JSON from ${url}`);
    return null;
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    console.warn(
      `[drop-rates] Could not fetch optional JSON from ${url}: ${response.status}`,
    );
    return null;
  }

  try {
    return await response.json();
  } catch {
    console.warn(`[drop-rates] Optional JSON at ${url} is not valid JSON`);
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

function publicLeagueMetadata(league, historical) {
  const metadata = {
    id: league.id,
    name: league.name,
    historical,
  };

  for (const field of LEAGUE_STAT_FIELDS) {
    const value = league[field];
    if (Number.isFinite(value)) {
      metadata[field] = value;
    }
  }

  return metadata;
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

function roundRatio(value) {
  if (!Number.isFinite(value)) return null;
  return Number(value.toFixed(12));
}

function floorCount(value) {
  if (!Number.isFinite(value)) return null;
  return Math.floor(value);
}

function ratioDelta(current, baseline) {
  if (
    !Number.isFinite(current) ||
    !Number.isFinite(baseline) ||
    baseline <= 0
  ) {
    return null;
  }

  return roundRatio((current - baseline) / baseline);
}

function chanceWeight(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  return value ** (2 / 3);
}

function chanceFromWeight(value, totalChanceWeight) {
  const weighted = chanceWeight(value);
  if (weighted === null || totalChanceWeight <= 0) return null;
  return weighted / totalChanceWeight;
}

function referenceFileUrl(baseUrl, leagueName) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  return `${normalizedBaseUrl}/cards-${encodeURIComponent(leagueName)}.json`;
}

function latestReferenceFileUrl(baseUrl) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  return `${normalizedBaseUrl}/cards.json`;
}

function validateReferenceCards(cards, leagueName) {
  if (!Array.isArray(cards)) {
    throw new Error(`Invalid reference card payload for ${leagueName}`);
  }

  for (const [index, card] of cards.entries()) {
    if (
      !card ||
      typeof card !== "object" ||
      typeof card.name !== "string" ||
      typeof card.weight !== "number" ||
      (card.is_disabled !== undefined &&
        typeof card.is_disabled !== "boolean") ||
      typeof card.from_boss !== "boolean"
    ) {
      throw new Error(
        `Invalid reference card row for ${leagueName} at index ${index}`,
      );
    }
  }
}

function isReferenceCardDisabled(card) {
  return card.is_disabled === true;
}

function isReferenceCardFromBoss(card) {
  return card.from_boss === true;
}

async function fetchReferenceData({ game, leagueName, referenceDataBaseUrl }) {
  if (game !== "poe1") return null;

  const sourceUrl = referenceFileUrl(referenceDataBaseUrl, leagueName);
  let resolvedSourceUrl = sourceUrl;
  let cards = await fetchOptionalRawJson(sourceUrl);

  if (!cards) {
    const fallbackUrl = latestReferenceFileUrl(referenceDataBaseUrl);
    cards = await fetchOptionalRawJson(fallbackUrl);

    if (!cards) {
      console.warn(
        `[drop-rates] No reference weights found for ${game}/${leagueName}`,
      );
      return null;
    }

    resolvedSourceUrl = fallbackUrl;
    console.warn(
      `[drop-rates] No league-specific reference weights found for ${game}/${leagueName}; using latest weights from ${fallbackUrl}`,
    );
  }

  validateReferenceCards(cards, leagueName);

  const eligibleCards = cards.filter(
    (card) =>
      !isReferenceCardDisabled(card) &&
      !isReferenceCardFromBoss(card) &&
      card.weight > 0,
  );
  const totalWeight = eligibleCards.reduce((sum, card) => sum + card.weight, 0);
  const totalChanceWeight = eligibleCards.reduce(
    (sum, card) => sum + (chanceWeight(card.weight) ?? 0),
    0,
  );

  if (totalWeight <= 0 || totalChanceWeight <= 0) {
    console.warn(
      `[drop-rates] Reference weights for ${game}/${leagueName} have no eligible cards`,
    );
    return null;
  }

  const cardByName = new Map(cards.map((card) => [card.name, card]));
  const eligibleCardNames = new Set(eligibleCards.map((card) => card.name));

  return {
    source: "fateweaver",
    source_url: resolvedSourceUrl,
    total_weight: totalWeight,
    total_chance_weight: totalChanceWeight,
    eligible_card_count: eligibleCards.length,
    card_count: cards.length,
    cardByName,
    eligibleCardNames,
  };
}

function enrichCardsWithReference(cards, referenceData) {
  const cardsByName = new Map(cards.map((card) => [card.name, card]));

  if (referenceData) {
    for (const cardName of referenceData.eligibleCardNames) {
      if (cardsByName.has(cardName)) continue;

      const missingCard = {
        card_id: cardName,
        name: cardName,
        count: 0,
        ratio: 0,
        verified_count: 0,
        verified_ratio: 0,
        community_estimated_weight: null,
        verified_community_estimated_weight: null,
      };
      cardsByName.set(cardName, missingCard);
      cards.push(missingCard);
    }
  }

  const verifiedObservedTotal = cards.reduce((sum, card) => {
    if (!referenceData?.eligibleCardNames.has(card.name)) return sum;
    return sum + card.verified_count;
  }, 0);

  return {
    cards: cards
      .map((card) => {
        const referenceCard = referenceData?.cardByName.get(card.name);
        const referenceEligible =
          referenceData !== null &&
          referenceData !== undefined &&
          referenceCard !== undefined &&
          referenceData?.eligibleCardNames.has(card.name);
        const referenceEstimatedChance = referenceEligible
          ? chanceFromWeight(
              referenceCard.weight,
              referenceData.total_chance_weight,
            )
          : null;
        const playersSaw = card.ratio ?? null;
        const verifiedPlayersSaw =
          verifiedObservedTotal > 0 ? (card.verified_ratio ?? null) : null;
        const communityEstimatedWeight = floorCount(
          card.community_estimated_weight,
        );
        const verifiedCommunityEstimatedWeight = floorCount(
          card.verified_community_estimated_weight,
        );

        return {
          name: card.name,
          count: card.count,
          ratio: card.ratio,
          verified_count: card.verified_count,
          verified_ratio: card.verified_ratio,
          reference_weight: referenceCard?.weight ?? null,
          players_saw: roundRatio(playersSaw),
          reference_estimated_chance: roundRatio(referenceEstimatedChance),
          seen_vs_reference:
            referenceEstimatedChance && playersSaw !== null
              ? roundRatio(playersSaw / referenceEstimatedChance)
              : null,
          verified_players_saw: roundRatio(verifiedPlayersSaw),
          verified_seen_vs_reference:
            referenceEstimatedChance && verifiedPlayersSaw !== null
              ? roundRatio(verifiedPlayersSaw / referenceEstimatedChance)
              : null,
          community_estimated_weight: communityEstimatedWeight,
          community_estimated_weight_delta_vs_reference: ratioDelta(
            communityEstimatedWeight,
            referenceCard?.weight,
          ),
          verified_community_estimated_weight: verifiedCommunityEstimatedWeight,
          verified_community_estimated_weight_delta_vs_reference: ratioDelta(
            verifiedCommunityEstimatedWeight,
            referenceCard?.weight,
          ),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
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
        // Keep this aligned with the website card route id. Today the card
        // catalog uses the card name as its id.
        card_id: card.name,
        name: card.name,
        count: stats.count,
        ratio: stats.ratio,
        verified_count: stats.verified_count,
        verified_ratio: stats.verified_ratio,
        community_estimated_weight: stats.community_estimated_weight ?? null,
        verified_community_estimated_weight:
          stats.verified_community_estimated_weight ?? null,
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
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    game,
    league: publicLeagueMetadata(league, historical),
    cards,
  };

  const target = leagueFilePath(outputDir, game, league.id);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, jsonStringify(body));

  return {
    ...publicLeagueMetadata(league, historical),
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
    schema_version: SCHEMA_VERSION,
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
    schema_version: SCHEMA_VERSION,
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
      process.env.VITE_DROP_RATES_BASE_URL ??
      DEFAULT_PUBLIC_BASE_URL,
  );
  const referenceDataBaseUrl = normalizeBaseUrl(
    process.env.DROP_RATES_REFERENCE_DATA_BASE_URL ??
      DEFAULT_REFERENCE_DATA_BASE_URL,
  );
  const games = (process.env.DROP_RATES_GAMES ?? DEFAULT_GAMES.join(","))
    .split(",")
    .map((game) => game.trim())
    .filter(Boolean);
  const envBackfillHistorical = parseOptionalBoolean(
    process.env.DROP_RATES_BACKFILL_HISTORICAL,
  );
  const hasBackfillOverride =
    args.backfillHistorical !== null || envBackfillHistorical !== null;
  const forceBackfill =
    args.backfillHistorical === true || envBackfillHistorical === true;
  const generatedAt = new Date().toISOString();

  const previousManifest = forceBackfill
    ? null
    : await fetchOptionalJson(`${publicBaseUrl}/index.json`);
  const requiresSchemaBackfill =
    previousManifest !== null &&
    previousManifest?.schema_version !== SCHEMA_VERSION;
  const shouldBackfill =
    requiresSchemaBackfill ||
    (hasBackfillOverride ? forceBackfill : !previousManifest);

  if (requiresSchemaBackfill) {
    console.log(
      `[drop-rates] Static schema changed from ${previousManifest.schema_version ?? "unknown"} to ${SCHEMA_VERSION}; rebuilding historical data`,
    );
  }

  if (!previousManifest && !shouldBackfill) {
    console.warn(
      "[drop-rates] Previous manifest unavailable; historical backfill is disabled",
    );
  }

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

      const referenceData = await fetchReferenceData({
        game,
        leagueName: league.name,
        referenceDataBaseUrl,
      });
      const enriched = enrichCardsWithReference(cards, referenceData);

      leagueEntries.push(
        await writeLeagueFile({
          outputDir,
          generatedAt,
          game,
          league,
          cards: enriched.cards,
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

        const referenceData = await fetchReferenceData({
          game,
          leagueName: league.name,
          referenceDataBaseUrl,
        });
        const enriched = enrichCardsWithReference(cards, referenceData);

        leagueEntries.push(
          await writeLeagueFile({
            outputDir,
            generatedAt,
            game,
            league,
            cards: enriched.cards,
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
