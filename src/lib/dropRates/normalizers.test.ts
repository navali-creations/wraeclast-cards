import { describe, expect, it } from "vitest";
import { normalizeLeagueDropRates } from "./normalizers";

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
});
