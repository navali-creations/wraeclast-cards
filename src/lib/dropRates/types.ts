export type Game = "poe1" | "poe2";

// One league's entry in a game's league index (see GameDropRates).
export interface DropRateLeague {
  id: string;
  name: string;
  // Whether this league has ended (vs. currently active).
  historical: boolean;
  // Where to fetch this league's full card data (LeagueDropRates).
  url: string;
  card_count: number;
  generated_at: string;
}

// Shape of `<game>/index.json`: the list of leagues with drop-rate data
// available for a game, fetched by useGameDropRates.
export interface GameDropRates {
  schema_version: number;
  generated_at: string;
  game: Game;
  leagues: DropRateLeague[];
}

export interface DropRateCard {
  // Website card route id. Older generated files may not have this yet.
  card_id?: string;
  name: string;
  // Drops reported for this card across all sources.
  count: number;
  // Share of all reported drops for this card.
  ratio: number;
  // Drops reported for this card from verified sources only.
  verified_count: number;
  // Share of verified reported drops for this card.
  verified_ratio: number;
  // Chance estimated from the external Fateweaver/Prohibited Library reference.
  reference_estimated_chance: number | null;
  // Share of players who reported seeing this card ("Players Saw").
  players_saw: number | null;
  verified_players_saw: number | null;
  // players_saw vs. reference_estimated_chance.
  seen_vs_reference: number | null;
  verified_seen_vs_reference: number | null;
  // External modeled drop weight used as the reference.
  reference_weight: number | null;
  // Weight estimated from community data ("Community Weight").
  community_estimated_weight: number | null;
  verified_community_estimated_weight: number | null;
  community_estimated_weight_delta_vs_reference: number | null;
  verified_community_estimated_weight_delta_vs_reference: number | null;
}

// Shape of `<game>/<leagueId>.json`: the full per-card drop-rate data for
// one league, fetched by useLeagueDropRates.
export interface LeagueDropRates {
  schema_version: number;
  generated_at: string;
  game: Game;
  league: {
    id: string;
    name: string;
    historical: boolean;
  };
  cards: DropRateCard[];
}
