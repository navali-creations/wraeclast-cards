import type {
  DropRateCard,
  DropRateLeague,
  Game,
  GameDropRates,
  LeagueDropRates,
} from "./types";

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

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
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
    url: stringOrEmpty(value.url),
    card_count: numberOrZero(value.card_count),
    generated_at: stringOrEmpty(value.generated_at),
  };
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

export function normalizeLeagueDropRates(
  value: unknown,
  requestedGame: Game,
): LeagueDropRates {
  if (!isRecord(value)) {
    throw new Error("Unexpected league drop rates shape");
  }

  const league = isRecord(value.league) ? value.league : {};

  return {
    schema_version: numberOrZero(value.schema_version),
    generated_at: stringOrEmpty(value.generated_at),
    game: gameOrFallback(value.game, requestedGame),
    league: {
      id: stringOrEmpty(league.id),
      name: stringOrEmpty(league.name),
      historical: booleanOrFalse(league.historical),
    },
    cards: records(value.cards).map(normalizeCard),
  };
}
