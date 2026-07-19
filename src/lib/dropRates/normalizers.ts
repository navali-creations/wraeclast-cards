import { createDivinationCardRouteIndex } from "../divinationCards.ts";
import type {
  DropRateCard,
  DropRateLeague,
  DropRateReference,
  DropRatesIndex,
  DropRatesRootGame,
  Game,
  GameDropRates,
  LeagueDropRates,
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
  return value === "poe1" || value === "poe2" ? value : fallback;
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
  return {
    name: stringOrEmpty(value.name),
    count: numberOrZero(value.count),
    ratio: numberOrZero(value.ratio),
    verified_count: numberOrZero(value.verified_count),
    verified_ratio: numberOrZero(value.verified_ratio),
    reference_estimated_chance: numberOrNull(value.reference_estimated_chance),
    players_saw: numberOrNull(value.players_saw),
    verified_players_saw: numberOrNull(value.verified_players_saw),
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
    cards,
  };
}
