import { createDivinationCardRouteIndex } from "../divinationCards.ts";
import type {
  CardTimeBuckets,
  DropRateCard,
  DropRateContextLinks,
  DropRateLeague,
  DropRateReference,
  DropRatesIndex,
  DropRatesRootGame,
  Game,
  GameDropRates,
  LeagueDropLocations,
  LeagueDropRates,
  LeagueTimeBuckets,
} from "./types";

const KNOWN_GAMES: Game[] = ["poe1", "poe2"];

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function numberOrZero(value: unknown): number {
  return numberOrNull(value) ?? 0;
}

function numberOrUndefined(value: unknown): number | undefined {
  return numberOrNull(value) ?? undefined;
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function booleanOrFalse(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function gameOrFallback(value: unknown, fallback: Game): Game {
  if (value === undefined || value === "") return fallback;
  if (value !== fallback) {
    throw new Error(
      `Expected ${fallback} drop-rate data, received ${String(value)}`,
    );
  }
  return fallback;
}

function records(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function normalizeLeague(value: JsonRecord): DropRateLeague {
  return {
    id: stringOrEmpty(value.id),
    name: stringOrEmpty(value.name),
    historical: booleanOrFalse(value.historical),
    observed_total: numberOrUndefined(value.observed_total),
    reference_source_url: stringOrUndefined(value.reference_source_url),
    url: stringOrEmpty(value.url),
    card_count: numberOrZero(value.card_count),
    generated_at: stringOrEmpty(value.generated_at),
  };
}

export function normalizeReference(value: unknown): DropRateReference | null {
  if (!isRecord(value)) return null;
  const sourceUrl = stringOrUndefined(value.source_url);
  return sourceUrl ? { source_url: sourceUrl } : null;
}

function normalizeCard(value: JsonRecord): DropRateCard {
  const ratio = numberOrNull(value.ratio) ?? numberOrZero(value.players_saw);
  const verifiedRatio =
    numberOrNull(value.verified_ratio) ??
    numberOrZero(value.verified_players_saw);

  return {
    name: stringOrEmpty(value.name),
    count: numberOrZero(value.count),
    ratio,
    verified_count: numberOrZero(value.verified_count),
    verified_ratio: verifiedRatio,
    reference_estimated_chance: numberOrNull(value.reference_estimated_chance),
    seen_vs_reference: numberOrNull(value.seen_vs_reference),
    verified_seen_vs_reference: numberOrNull(value.verified_seen_vs_reference),
    reference_weight: numberOrNull(value.reference_weight),
    community_estimated_weight: numberOrNull(value.community_estimated_weight),
    verified_community_estimated_weight: numberOrNull(
      value.verified_community_estimated_weight,
    ),
    community_estimated_weight_delta_vs_reference: numberOrNull(
      value.community_estimated_weight_delta_vs_reference,
    ),
    verified_community_estimated_weight_delta_vs_reference: numberOrNull(
      value.verified_community_estimated_weight_delta_vs_reference,
    ),
  };
}

function normalizeCountMap(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key, count]) =>
          key.trim().length > 0 &&
          typeof count === "number" &&
          Number.isFinite(count) &&
          count >= 0,
      )
      .map(([key, count]) => [key, Math.floor(count as number)]),
  );
}

function normalizeTimeBuckets(value: unknown): Record<string, number> {
  const buckets = normalizeCountMap(value);

  return Object.fromEntries(
    Object.entries(buckets).filter(([key]) => {
      const minute = Number(key);
      return (
        Number.isInteger(minute) &&
        minute >= 0 &&
        minute < 1440 &&
        minute % 15 === 0
      );
    }),
  );
}

function normalizeCardTimeBuckets(value: unknown): CardTimeBuckets {
  if (!isRecord(value)) return { utc: {}, local: {} };

  // Schema 7 published a single player-local map. Preserve it as local data
  // while leaving UTC empty rather than mislabelling it as global time.
  const hasNamedSeries = isRecord(value.utc) || isRecord(value.local);
  if (!hasNamedSeries) {
    return { utc: {}, local: normalizeTimeBuckets(value) };
  }

  return {
    utc: normalizeTimeBuckets(value.utc),
    local: normalizeTimeBuckets(value.local),
  };
}

function addCountMaps(
  target: Record<string, number>,
  source: Readonly<Record<string, number>>,
) {
  for (const [key, count] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + count;
  }
}

function deriveTimeBucketTotals(
  cards: Readonly<Record<string, CardTimeBuckets>>,
): CardTimeBuckets {
  const totals: CardTimeBuckets = { utc: {}, local: {} };
  for (const card of Object.values(cards)) {
    addCountMaps(totals.utc, card.utc);
    addCountMaps(totals.local, card.local);
  }
  return totals;
}

function sumCountMap(value: Readonly<Record<string, number>>): number {
  return Object.values(value).reduce((sum, count) => sum + count, 0);
}

function normalizeContextLinks(value: unknown): DropRateContextLinks | null {
  if (!isRecord(value)) return null;

  const timeBucketsUrl = stringOrUndefined(value.time_buckets_url);
  const locationsUrl = stringOrUndefined(value.locations_url);
  if (!timeBucketsUrl || !locationsUrl) return null;

  return {
    time_buckets_url: timeBucketsUrl,
    locations_url: locationsUrl,
  };
}

function normalizeContextCards(
  value: unknown,
  normalizeCounts: (value: unknown) => Record<string, number>,
): Record<string, Record<string, number>> {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([cardName, counts]) => cardName.trim().length > 0 && isRecord(counts),
      )
      .map(([cardName, counts]) => [cardName, normalizeCounts(counts)]),
  );
}

function normalizeContextLeague(value: unknown, expectedLeagueId?: string) {
  if (!isRecord(value)) {
    throw new Error("Missing league identity in drop-context data");
  }

  const id = stringOrEmpty(value.id);
  const name = stringOrEmpty(value.name);
  if (!id || !name || (expectedLeagueId && id !== expectedLeagueId)) {
    throw new Error("Unexpected league identity in drop-context data");
  }

  return { id, name, historical: booleanOrFalse(value.historical) };
}

function normalizeContextMetadata(
  value: JsonRecord,
  requestedGame: Game,
  expectedLeagueId?: string,
) {
  const schemaVersion = numberOrNull(value.schema_version);
  const generatedAt = stringOrEmpty(value.generated_at);
  if (
    !Number.isInteger(schemaVersion) ||
    (schemaVersion ?? 0) < 7 ||
    !generatedAt
  ) {
    throw new Error("Unexpected drop-context document metadata");
  }

  return {
    schema_version: schemaVersion as number,
    generated_at: generatedAt,
    game: gameOrFallback(value.game, requestedGame),
    league: normalizeContextLeague(value.league, expectedLeagueId),
  };
}

export function normalizeLeagueTimeBuckets(
  value: unknown,
  requestedGame: Game,
  expectedLeagueId?: string,
): LeagueTimeBuckets {
  if (!isRecord(value) || value.bucket_minutes !== 15) {
    throw new Error("Unexpected league time-bucket data shape");
  }

  const cards = isRecord(value.cards)
    ? Object.fromEntries(
        Object.entries(value.cards)
          .filter(
            ([cardName, buckets]) =>
              cardName.trim().length > 0 && isRecord(buckets),
          )
          .map(([cardName, buckets]) => [
            cardName,
            normalizeCardTimeBuckets(buckets),
          ]),
      )
    : {};
  const publishedTotals = normalizeCardTimeBuckets(value.totals);
  const totals =
    Object.keys(publishedTotals.utc).length > 0 ||
    Object.keys(publishedTotals.local).length > 0
      ? publishedTotals
      : deriveTimeBucketTotals(cards);
  const derivedObservedTotal = Math.max(
    sumCountMap(totals.utc),
    sumCountMap(totals.local),
  );
  const metadata = normalizeContextMetadata(
    value,
    requestedGame,
    expectedLeagueId,
  );

  return {
    ...metadata,
    bucket_minutes: 15,
    observed_total: Math.max(
      numberOrZero(value.observed_total),
      derivedObservedTotal,
    ),
    totals,
    cards,
  };
}

export function normalizeLeagueDropLocations(
  value: unknown,
  requestedGame: Game,
  expectedLeagueId?: string,
): LeagueDropLocations {
  if (
    !isRecord(value) ||
    !isRecord(value.totals) ||
    !isRecord(value.card_totals) ||
    !isRecord(value.cards)
  ) {
    throw new Error("Unexpected league location data shape");
  }
  const metadata = normalizeContextMetadata(
    value,
    requestedGame,
    expectedLeagueId,
  );

  return {
    ...metadata,
    observed_total: numberOrZero(value.observed_total),
    located_total: numberOrZero(value.located_total),
    totals: normalizeCountMap(value.totals),
    card_totals: normalizeCountMap(value.card_totals),
    cards: normalizeContextCards(value.cards, normalizeCountMap),
  };
}

export function normalizeGameDropRates(
  value: unknown,
  requestedGame: Game,
): GameDropRates {
  if (!isRecord(value)) {
    throw new Error("Unexpected drop rates index shape");
  }

  return {
    schema_version: numberOrZero(value.schema_version),
    generated_at: stringOrEmpty(value.generated_at),
    game: gameOrFallback(value.game, requestedGame),
    leagues: records(value.leagues).map(normalizeLeague),
  };
}

function normalizeRootGame(value: unknown): DropRatesRootGame {
  const game = isRecord(value) ? value : {};

  return {
    leagues: records(game.leagues).map(normalizeLeague),
  };
}

export function normalizeDropRatesIndex(value: unknown): DropRatesIndex {
  if (!isRecord(value)) {
    throw new Error("Unexpected drop rates root index shape");
  }

  if (!isRecord(value.games)) {
    throw new Error("Unexpected drop rates root index shape");
  }

  const rawGames = value.games;
  const games: Partial<Record<Game, DropRatesRootGame>> = {};

  for (const game of KNOWN_GAMES) {
    if (isRecord(rawGames[game])) {
      games[game] = normalizeRootGame(rawGames[game]);
    }
  }

  if (Object.keys(games).length === 0) {
    throw new Error("Unexpected drop rates root index shape");
  }

  return {
    schema_version: numberOrZero(value.schema_version),
    generated_at: stringOrEmpty(value.generated_at),
    games,
  };
}

export function normalizeLeagueDropRates(
  value: unknown,
  requestedGame: Game,
): LeagueDropRates {
  if (!isRecord(value)) {
    throw new Error("Unexpected league drop rates shape");
  }

  const league = isRecord(value.league) ? value.league : {};

  const cards = records(value.cards).map(normalizeCard);
  createDivinationCardRouteIndex(cards);

  return {
    schema_version: numberOrZero(value.schema_version),
    generated_at: stringOrEmpty(value.generated_at),
    game: gameOrFallback(value.game, requestedGame),
    league: {
      id: stringOrEmpty(league.id),
      name: stringOrEmpty(league.name),
      historical: booleanOrFalse(league.historical),
    },
    reference: normalizeReference(value.reference),
    context: normalizeContextLinks(value.context),
    cards,
  };
}
