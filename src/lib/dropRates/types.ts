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
  url: string;
  league_count: number;
  leagues: DropRateLeague[];
}

export interface DropRateCard {
  name: string;
  // Drops reported for this card across all sources.
  count: number;
  // Drops reported for this card from verified sources only.
  verified_count: number;
  // Modeled drop chance ("Research Chance").
  research_chance: number | null;
  // Share of players who reported seeing this card ("Players Saw").
  players_saw: number | null;
  verified_players_saw: number | null;
  // players_saw vs. research_chance ("Compared to Research").
  seen_vs_research: number | null;
  verified_seen_vs_research: number | null;
  // Modeled drop weight ("Research Weight").
  research_weight: number;
  // Weight estimated from community data ("Community Weight").
  community_estimated_weight: number;
  verified_community_estimated_weight: number | null;
  // Drops expected given the estimated weight ("Expected Drops").
  expected_drops: number | null;
  verified_expected_drops: number | null;
  // expected_drops vs. actual drops reported ("Difference").
  drop_difference: number | null;
  verified_drop_difference: number | null;
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
