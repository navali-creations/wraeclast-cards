import { describe, expect, it } from "vitest";
import { EGame } from "../enums";
import { createGameLeagueCardSeoHead } from "./seo";

describe("card route SEO head", () => {
  it("indexes a card when route-loaded facts exist", () => {
    const head = createGameLeagueCardSeoHead({
      game: EGame.Poe1,
      leagueSlug: "keepers",
      leagueName: "Keepers of the Flame",
      cardId: "a-chilling-wind",
      facts: {
        name: "A Chilling Wind",
        slug: "a-chilling-wind",
      },
    });

    expect(head.meta).toContainEqual({
      name: "robots",
      content: "index, follow",
    });
    expect(head.links).toEqual([
      {
        rel: "canonical",
        href: "https://wraeclast.cards/path-of-exile/keepers/cards/a-chilling-wind",
      },
    ]);
    expect(head.meta).toContainEqual(
      expect.objectContaining({
        title: expect.stringContaining("A Chilling Wind"),
      }),
    );
  });

  it("removes the canonical and prevents indexing for a missing card", () => {
    const head = createGameLeagueCardSeoHead({
      game: EGame.Poe1,
      leagueSlug: "keepers",
      cardId: "missing-card",
      status: "not-found",
    });

    expect(head.meta).toContainEqual({
      name: "robots",
      content: "noindex, nofollow",
    });
    expect(head.links).toEqual([]);
  });
});
