import { describe, expect, it } from "vitest";
import { buildDropContextDocuments } from "./drop-rate-context.mjs";
import { normalizePreservedSupplementalDocument } from "./generate-drop-rate-static-data.mjs";

const metadata = {
  schema_version: 9,
  generated_at: "2026-10-27T00:00:00.000Z",
  game: "poe1",
  league: {
    id: "allflame-id",
    name: "Allflame",
    historical: false,
  },
  bucket_minutes: 15,
  observed_total: 14,
  totals: {
    utc: { 0: 6, 15: 8 },
    local: { 60: 7, 75: 7 },
  },
};

describe("drop-rate supplemental documents", () => {
  it("preserves schema-9 denominators and card time series", () => {
    const document = {
      ...metadata,
      cards: {
        "A Dab of Ink": {
          utc: { 0: 2, 15: 5 },
          local: { 60: 3, 75: 4 },
        },
      },
    };

    expect(
      normalizePreservedSupplementalDocument(document, {
        game: "poe1",
        leagueId: "allflame-id",
        leagueName: "Allflame",
        historical: true,
        kind: "time-buckets",
      }),
    ).toEqual({
      ...metadata,
      league: { ...metadata.league, historical: true },
      cards: document.cards,
    });
  });

  it("round-trips freshly projected time buckets through preservation", () => {
    const projection = buildDropContextDocuments({
      totals: {
        observed_events: 5,
        located_events: 5,
        utc_time_buckets: Array.from({ length: 96 }, (_, index) => ({
          minute: index * 15,
          count: index === 0 ? 5 : 0,
        })),
        local_time_buckets: Array.from({ length: 96 }, (_, index) => ({
          minute: index * 15,
          count: index === 4 ? 5 : 0,
        })),
        locations: [{ name: "Atlas Hideout", count: 5 }],
      },
      cards: [
        {
          name: "A Dab of Ink",
          observed_events: 5,
          located_events: 5,
          utc_time_buckets: Array.from({ length: 96 }, (_, index) => ({
            minute: index * 15,
            count: index === 0 ? 2 : 0,
          })),
          local_time_buckets: Array.from({ length: 96 }, (_, index) => ({
            minute: index * 15,
            count: index === 4 ? 3 : 0,
          })),
          locations: [],
        },
      ],
    });

    const document = {
      ...metadata,
      observed_total: projection.observedTotal,
      totals: projection.timeBucketTotals,
      cards: projection.timeBucketsByCard,
    };
    const preserved = normalizePreservedSupplementalDocument(document, {
      game: "poe1",
      leagueId: "allflame-id",
      leagueName: "Allflame",
      historical: true,
      kind: "time-buckets",
    });

    expect(preserved.cards).toEqual({
      "A Dab of Ink": { utc: { 0: 2 }, local: { 60: 3 } },
    });
    expect(preserved.totals).toEqual({
      utc: { 0: 5 },
      local: { 60: 5 },
    });
  });

  it("preserves exact location denominators independently of top-card locations", () => {
    const {
      bucket_minutes: _bucketMinutes,
      observed_total: _observedTotal,
      totals: _timeTotals,
      ...locationMetadata
    } = metadata;
    const document = {
      ...locationMetadata,
      observed_total: 14,
      located_total: 12,
      totals: { "Atlas Hideout": 10, "The Menagerie": 2 },
      card_totals: { "A Dab of Ink": 4 },
      cards: { "A Dab of Ink": { "Atlas Hideout": 3 } },
    };

    expect(
      normalizePreservedSupplementalDocument(document, {
        game: "poe1",
        leagueId: "allflame-id",
        leagueName: "Allflame",
        historical: true,
        kind: "locations",
      }),
    ).toEqual({
      ...document,
      league: { ...metadata.league, historical: true },
    });
  });

  it("rejects the obsolete flat time-bucket shape for schema 9", () => {
    expect(() =>
      normalizePreservedSupplementalDocument(
        { ...metadata, cards: { "A Dab of Ink": { 0: 2 } } },
        {
          game: "poe1",
          leagueId: "allflame-id",
          leagueName: "Allflame",
          historical: true,
          kind: "time-buckets",
        },
      ),
    ).toThrow("Invalid preserved time-buckets for Allflame/A Dab of Ink");
  });
});
