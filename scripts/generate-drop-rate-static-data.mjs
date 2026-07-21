import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { createDropRateRequestHeaders } from "./drop-rate-request.mjs";

const DEFAULT_GAMES = ["poe1", "poe2"];
const DEFAULT_OUTPUT_DIR = "dist/data/drop-rates";
const DEFAULT_PUBLIC_BASE_URL = "https://wraeclast.cards/data/drop-rates";
const DEFAULT_REFERENCE_DATA_BASE_URL =
  "https://cdn.jsdelivr.net/gh/navali-creations/fateweaver@main/packages/poe1-divination-cards/data";
const SCHEMA_VERSION = 6;
const CACHE_SECONDS = 7 * 24 * 60 * 60;
const BROWSER_CACHE_SECONDS = 60 * 60;
const FETCH_TIMEOUT_MS = 15_000;
const execFileAsync = promisify(execFile);

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

function parseJsdelivrGithubUrl(value) {
  try {
    const url = new URL(value);
    if (url.hostname !== "cdn.jsdelivr.net") return null;

    const match = url.pathname.match(/^\/gh\/([^/]+)\/([^/@]+)@([^/]+)\/(.+)$/);
    if (!match) return null;

    const [, owner, repo, ref, pathPrefix] = match;
    return { owner, repo, ref, pathPrefix };
  } catch {
    return null;
  }
}

function parseRawGithubUrl(value) {
  try {
    const url = new URL(value);
    if (url.hostname !== "raw.githubusercontent.com") return null;

    const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!match) return null;

    const [, owner, repo, ref, pathPrefix] = match;
    return { owner, repo, ref, pathPrefix };
  } catch {
    return null;
  }
}

function isPinnedPackageReferenceBaseUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.hostname === "cdn.jsdelivr.net" &&
      /^\/npm\/@navali\/poe1-divination-cards@[0-9]+\.[0-9]+\.[0-9]+(?:[-+][^/]+)?\/data$/.test(
        url.pathname,
      )
    );
  } catch {
    return false;
  }
}

function isLocalReferenceBaseUrl(value) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  } catch {
    return false;
  }
}

async function resolveGithubCommit({ owner, repo, ref }) {
  if (/^[0-9a-f]{40}$/i.test(ref)) return ref;

  const remoteUrl = `https://github.com/${owner}/${repo}.git`;
  const branchRef = `refs/heads/${ref}`;
  const peeledTagRef = `refs/tags/${ref}^{}`;
  const tagRef = `refs/tags/${ref}`;
  let stdout;

  try {
    ({ stdout } = await execFileAsync(
      "git",
      ["ls-remote", "--exit-code", remoteUrl, branchRef, peeledTagRef, tagRef],
      {
        env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
        timeout: FETCH_TIMEOUT_MS,
        windowsHide: true,
      },
    ));
  } catch (error) {
    throw new Error(`Could not resolve ${owner}/${repo}@${ref}`, {
      cause: error,
    });
  }

  const commitsByRef = new Map(
    stdout
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.split(/\s+/, 2).reverse()),
  );
  const sha =
    commitsByRef.get(branchRef) ??
    commitsByRef.get(peeledTagRef) ??
    commitsByRef.get(tagRef);

  if (!sha || !/^[0-9a-f]{40}$/i.test(sha)) {
    throw new Error(`Could not resolve ${owner}/${repo}@${ref}`);
  }

  return sha;
}

async function resolveReferenceDataBaseUrl(baseUrl) {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const jsdelivrGithubUrl = parseJsdelivrGithubUrl(normalizedBaseUrl);
  if (jsdelivrGithubUrl) {
    const sha = await resolveGithubCommit(jsdelivrGithubUrl);
    return `https://cdn.jsdelivr.net/gh/${jsdelivrGithubUrl.owner}/${jsdelivrGithubUrl.repo}@${sha}/${jsdelivrGithubUrl.pathPrefix}`;
  }

  const rawGithubUrl = parseRawGithubUrl(normalizedBaseUrl);
  if (rawGithubUrl) {
    const sha = await resolveGithubCommit(rawGithubUrl);
    return `https://raw.githubusercontent.com/${rawGithubUrl.owner}/${rawGithubUrl.repo}/${sha}/${rawGithubUrl.pathPrefix}`;
  }

  if (
    isPinnedPackageReferenceBaseUrl(normalizedBaseUrl) ||
    isLocalReferenceBaseUrl(normalizedBaseUrl)
  ) {
    return normalizedBaseUrl;
  }

  throw new Error(
    "DROP_RATES_REFERENCE_DATA_BASE_URL must be a jsDelivr GitHub URL, raw GitHub URL, pinned @navali package URL, or local development URL",
  );
}

function jsonStringify(data) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
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
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(`Could not fetch previous manifest from ${url}`, {
      cause: error,
    });
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Could not fetch previous manifest from ${url}: ${response.status}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Could not fetch previous manifest from ${url}: expected JSON, received ${contentType || "unknown content type"}`,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Previous manifest at ${url} is not valid JSON`, {
      cause: error,
    });
  }
}

async function fetchOptionalRawJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(`Could not fetch optional JSON from ${url}`, {
      cause: error,
    });
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Could not fetch optional JSON from ${url}: ${response.status}`,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Optional JSON at ${url} is not valid JSON`, {
      cause: error,
    });
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

function publicLeagueMetadata(league, historical, referenceData = null) {
  const metadata = {
    id: league.id,
    name: league.name,
    historical,
  };

  if (Number.isFinite(league.observed_total)) {
    metadata.observed_total = league.observed_total;
  }

  if (referenceData?.source_url) {
    metadata.reference_source_url = referenceData.source_url;
  }

  return metadata;
}

function publicReferenceMetadata(referenceData) {
  if (!referenceData) return null;

  return {
    source_url: referenceData.source_url,
  };
}

async function fetchDropRates({
  supabaseUrl,
  apiKey,
  callerToken,
  game,
  includeInactive,
}) {
  const url = new URL(
    `${normalizeBaseUrl(supabaseUrl)}/functions/v1/get-community-drop-rates`,
  );
  url.searchParams.set("game", game);

  if (includeInactive) {
    url.searchParams.set("include_inactive", "true");
  }

  const payload = await fetchJson(url.toString(), {
    headers: createDropRateRequestHeaders({ apiKey, callerToken }),
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

async function fetchReferenceData({
  game,
  leagueName,
  referenceDataBaseUrl,
  allowLatestFallback,
}) {
  if (game !== "poe1") return null;

  const sourceUrl = referenceFileUrl(referenceDataBaseUrl, leagueName);
  let resolvedSourceUrl = sourceUrl;
  let cards = await fetchOptionalRawJson(sourceUrl);

  if (!cards && allowLatestFallback) {
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

  if (!cards) {
    console.warn(
      `[drop-rates] No league-specific reference data found for historical league ${game}/${leagueName}`,
    );
    return null;
  }

  validateReferenceCards(cards, leagueName);

  const eligibleCards = cards.filter(
    (card) =>
      !isReferenceCardDisabled(card) &&
      !isReferenceCardFromBoss(card) &&
      card.weight > 0,
  );
  const totalChanceWeight = eligibleCards.reduce(
    (sum, card) => sum + (chanceWeight(card.weight) ?? 0),
    0,
  );

  if (totalChanceWeight <= 0) {
    console.warn(
      `[drop-rates] Reference weights for ${game}/${leagueName} have no eligible cards`,
    );
    return null;
  }

  const cardByName = new Map(cards.map((card) => [card.name, card]));
  const eligibleCardNames = new Set(eligibleCards.map((card) => card.name));

  return {
    source_url: resolvedSourceUrl,
    total_chance_weight: totalChanceWeight,
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
        const observedChance = card.ratio ?? null;
        const verifiedObservedChance =
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
          reference_estimated_chance: roundRatio(referenceEstimatedChance),
          seen_vs_reference:
            referenceEstimatedChance && observedChance !== null
              ? roundRatio(observedChance / referenceEstimatedChance)
              : null,
          verified_seen_vs_reference:
            referenceEstimatedChance && verifiedObservedChance !== null
              ? roundRatio(verifiedObservedChance / referenceEstimatedChance)
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

async function writeLeagueFile({
  outputDir,
  generatedAt,
  game,
  league,
  cards,
  historical,
  referenceData,
}) {
  const leagueMetadata = publicLeagueMetadata(
    league,
    historical,
    referenceData,
  );
  const referenceMetadata = publicReferenceMetadata(referenceData);
  const body = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    game,
    league: leagueMetadata,
    ...(referenceMetadata ? { reference: referenceMetadata } : {}),
    cards,
  };

  const target = leagueFilePath(outputDir, game, league.id);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, jsonStringify(body));

  return {
    ...leagueMetadata,
    url: leagueUrl(game, league.id),
    card_count: cards.length,
    generated_at: generatedAt,
  };
}

function requiredPreservedNumber(value, field, leagueName) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid ${field} in preserved data for ${leagueName}`);
  }

  return value;
}

const REQUIRED_PRESERVED_CARD_FIELDS = [
  "count",
  "ratio",
  "verified_count",
  "verified_ratio",
];
const NULLABLE_PRESERVED_CARD_FIELDS = [
  "reference_weight",
  "reference_estimated_chance",
  "seen_vs_reference",
  "verified_seen_vs_reference",
  "community_estimated_weight",
  "community_estimated_weight_delta_vs_reference",
  "verified_community_estimated_weight",
  "verified_community_estimated_weight_delta_vs_reference",
];

function normalizePreservedCard(card, leagueName) {
  if (
    !card ||
    typeof card !== "object" ||
    typeof card.name !== "string" ||
    card.name.trim().length === 0
  ) {
    throw new Error(`Invalid card in preserved data for ${leagueName}`);
  }

  const normalized = { name: card.name };
  for (const field of REQUIRED_PRESERVED_CARD_FIELDS) {
    normalized[field] = requiredPreservedNumber(card[field], field, leagueName);
  }
  for (const field of NULLABLE_PRESERVED_CARD_FIELDS) {
    normalized[field] =
      card[field] === null || card[field] === undefined
        ? null
        : requiredPreservedNumber(card[field], field, leagueName);
  }

  return normalized;
}

function normalizePreservedLeagueDocument(value, game, previousLeague) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid preserved data for ${game}/${previousLeague.id}`);
  }

  const league = value.league;
  if (
    value.game !== game ||
    !league ||
    typeof league !== "object" ||
    Array.isArray(league) ||
    league.id !== previousLeague.id ||
    !Array.isArray(value.cards)
  ) {
    throw new Error(`Invalid preserved data for ${game}/${previousLeague.id}`);
  }

  const name =
    typeof league.name === "string" && league.name.trim().length > 0
      ? league.name
      : previousLeague.name;
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new Error(`Invalid league name for ${game}/${previousLeague.id}`);
  }

  const observedTotal = Number.isFinite(previousLeague.observed_total)
    ? previousLeague.observed_total
    : Number.isFinite(league.observed_total)
      ? league.observed_total
      : undefined;
  const referenceSourceUrl =
    typeof previousLeague.reference_source_url === "string"
      ? previousLeague.reference_source_url
      : typeof league.reference_source_url === "string"
        ? league.reference_source_url
        : typeof value.reference?.source_url === "string"
          ? value.reference.source_url
          : undefined;
  const cards = value.cards
    .map((card) => normalizePreservedCard(card, name))
    .filter((card) => referenceSourceUrl !== undefined || card.count > 0);
  const generatedAt =
    typeof value.generated_at === "string"
      ? value.generated_at
      : previousLeague.generated_at;
  const leagueMetadata = {
    id: previousLeague.id,
    name,
    historical: true,
    ...(observedTotal === undefined ? {} : { observed_total: observedTotal }),
    ...(referenceSourceUrl === undefined
      ? {}
      : { reference_source_url: referenceSourceUrl }),
  };
  const document = {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    game,
    league: leagueMetadata,
    ...(referenceSourceUrl === undefined
      ? {}
      : { reference: { source_url: referenceSourceUrl } }),
    cards,
  };

  return {
    document,
    league: {
      ...leagueMetadata,
      url: leagueUrl(game, previousLeague.id),
      card_count: cards.length,
      generated_at: generatedAt,
    },
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
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Could not preserve ${game}/${previousLeague.id}: ${response.status}`,
    );
  }

  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Could not preserve ${game}/${previousLeague.id}: expected JSON, received ${contentType || "unknown content type"}`,
    );
  }

  const body = await response.text();
  let value;
  try {
    value = JSON.parse(body);
  } catch {
    throw new Error(
      `Could not preserve ${game}/${previousLeague.id}: invalid JSON`,
    );
  }
  const preserved = normalizePreservedLeagueDocument(
    value,
    game,
    previousLeague,
  );
  const target = leagueFilePath(outputDir, game, previousLeague.id);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, jsonStringify(preserved.document));

  return preserved.league;
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
  const callerToken = process.env.WRAECLAST_CARDS_CALLER_TOKEN?.trim() || null;
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
  const referenceDataBaseUrl = await resolveReferenceDataBaseUrl(
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

  const previousManifest = await fetchOptionalJson(
    `${publicBaseUrl}/index.json`,
  );
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
    throw new Error(
      "Previous manifest is missing while historical backfill is disabled; rerun with DROP_RATES_BACKFILL_HISTORICAL=true",
    );
  }

  const rootGames = {};

  for (const game of games) {
    console.log(`[drop-rates] Fetching active ${game} data`);
    const activePayload = await fetchDropRates({
      supabaseUrl,
      apiKey,
      callerToken,
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
        allowLatestFallback: true,
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
          referenceData,
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
        callerToken,
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
          allowLatestFallback: false,
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
            referenceData,
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

    rootGames[game] = { leagues: leagueEntries };
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
