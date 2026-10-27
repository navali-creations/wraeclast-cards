import { describe, expect, it } from "vitest";
import {
  normalizeLeagueDropLocations,
  normalizeLeagueDropRates,
  normalizeLeagueTimeBuckets,
} from "./normalizers";

function leagueDocument(card: Record<string, unknown>) {
  return {
    schema_version: 5,
    generated_at: "2026-07-21T00:00:00.000Z",
    game: "poe1",
    league: {
      id: "league-id",
      name: "Mirage",
      historical: false,
    },
    cards: [
      {
        name: "The Apothecary",
        count: 271,
        verified_count: 3,
        ...card,
      },
    ],
  };
}

describe("normalizeLeagueDropRates", () => {
  it("reads legacy Players Saw aliases without retaining duplicate fields", () => {
    const result = normalizeLeagueDropRates(
      leagueDocument({
        players_saw: 0.000064414351,
        verified_players_saw: 0.000055,
      }),
      "poe1",
    );
    const card = result.cards[0];

    expect(card.ratio).toBe(0.000064414351);
    expect(card.verified_ratio).toBe(0.000055);
    expect(card).not.toHaveProperty("players_saw");
    expect(card).not.toHaveProperty("verified_players_saw");
  });

  it("prefers canonical ratios in schema v6 documents", () => {
    const result = normalizeLeagueDropRates(
      leagueDocument({
        ratio: 0.25,
        verified_ratio: 0.2,
        players_saw: 0.5,
        verified_players_saw: 0.4,
      }),
      "poe1",
    );

    expect(result.cards[0].ratio).toBe(0.25);
    expect(result.cards[0].verified_ratio).toBe(0.2);
  });

  it("normalizes supplemental context links", () => {
    const result = normalizeLeagueDropRates(
      {
        ...leagueDocument({ ratio: 0.25, verified_ratio: 0.2 }),
        context: {
          time_buckets_url: "poe1/league-id.time-buckets.json",
          locations_url: "poe1/league-id.locations.json",
        },
      },
      "poe1",
    );

    expect(result.context).toEqual({
      time_buckets_url: "poe1/league-id.time-buckets.json",
      locations_url: "poe1/league-id.locations.json",
    });
  });
});

describe("drop-context normalizers", () => {
  const base = {
    schema_version: 9,
    generated_at: "2026-10-26T00:00:00.000Z",
    game: "poe1",
    league: { id: "league-id", name: "Mirage", historical: false },
  };

  it("normalizes time buckets for every card and drops invalid entries", () => {
    const result = normalizeLeagueTimeBuckets(
      {
        ...base,
        bucket_minutes: 15,
        observed_total: 12,
        totals: {
          utc: { 0: 5, 15: 7 },
          local: { 0: 6, 15: 6 },
        },
        cards: {
          "A Dab of Ink": {
            utc: { 0: 2, 15: 5, 14: 2, 1440: 3 },
            local: { 0: 1, 15: 4, 14: 2, 1440: 3 },
          },
          "": { 0: 100 },
        },
      },
      "poe1",
    );

    expect(result.cards).toEqual({
      "A Dab of Ink": {
        utc: { 0: 2, 15: 5 },
        local: { 0: 1, 15: 4 },
      },
    });
    expect(result.observed_total).toBe(12);
    expect(result.totals).toEqual({
      utc: { 0: 5, 15: 7 },
      local: { 0: 6, 15: 6 },
    });
  });

  it("keeps legacy single-series time buckets as player time", () => {
    const result = normalizeLeagueTimeBuckets(
      {
        ...base,
        schema_version: 7,
        bucket_minutes: 15,
        cards: { "A Dab of Ink": { 0: 1, 15: 4 } },
      },
      "poe1",
    );

    expect(result.cards).toEqual({
      "A Dab of Ink": { utc: {}, local: { 0: 1, 15: 4 } },
    });
    expect(result.observed_total).toBe(5);
    expect(result.totals).toEqual({ utc: {}, local: { 0: 1, 15: 4 } });
  });

  it("normalizes locations for every card and drops invalid entries", () => {
    const result = normalizeLeagueDropLocations(
      {
        ...base,
        observed_total: 12,
        located_total: 10,
        totals: { "Atlas Hideout": 10, "": 4, Broken: -1 },
        card_totals: { "A Dab of Ink": 7, "": 4, Broken: -1 },
        cards: {
          "A Dab of Ink": { "Atlas Hideout": 7, "": 10, Broken: -1 },
        },
      },
      "poe1",
    );

    expect(result.cards).toEqual({
      "A Dab of Ink": { "Atlas Hideout": 7 },
    });
    expect(result.observed_total).toBe(12);
    expect(result.located_total).toBe(10);
    expect(result.totals).toEqual({ "Atlas Hideout": 10 });
    expect(result.card_totals).toEqual({ "A Dab of Ink": 7 });
  });
});
