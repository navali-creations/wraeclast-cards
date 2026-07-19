import type { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { EGame } from "../../../../../enums";
import { loadCardSeoRouteData } from "./CardDetailsPage.utils";

describe("loadCardSeoRouteData", () => {
  it("loads card facts from the same query data used by the route", async () => {
    const ensureQueryData = vi
      .fn()
      .mockResolvedValueOnce({
        leagues: [
          {
            id: "keepers",
            name: "Keepers of the Flame",
            historical: false,
            url: "/data/drop-rates/poe1/keepers.json",
          },
        ],
      })
      .mockResolvedValueOnce({
        cards: [{ name: "A Chilling Wind", count: 12, ratio: 0.0125 }],
      })
      .mockResolvedValueOnce([
        {
          id: "a-chilling-wind",
          name: "A Chilling Wind",
          rewardText: "The Halcyon",
          stackSize: 4,
          fromBoss: false,
          rarity: 3,
          imageUrl: "https://example.com/a-chilling-wind.png",
        },
      ]);
    const queryClient = { ensureQueryData } as unknown as QueryClient;

    await expect(
      loadCardSeoRouteData(
        queryClient,
        EGame.Poe1,
        "keepers-of-the-flame",
        "a-chilling-wind",
      ),
    ).resolves.toEqual({
      leagueName: "Keepers of the Flame",
      facts: {
        name: "A Chilling Wind",
        slug: "a-chilling-wind",
        rewardText: "The Halcyon",
        stackSize: 4,
        fromBoss: false,
        rarity: "Less common",
        imageUrl: "https://example.com/a-chilling-wind.png",
        observedCount: 12,
        observedRate: 0.0125,
      },
    });
  });

  it("returns an explicit missing status when the league does not exist", async () => {
    const queryClient = {
      ensureQueryData: vi.fn().mockResolvedValue({ leagues: [] }),
    } as unknown as QueryClient;

    await expect(
      loadCardSeoRouteData(
        queryClient,
        EGame.Poe1,
        "unknown-league",
        "a-chilling-wind",
      ),
    ).resolves.toEqual({
      leagueName: "Unknown League",
      status: "not-found",
    });
  });

  it("returns catalog facts without observations", async () => {
    const ensureQueryData = vi
      .fn()
      .mockResolvedValueOnce({
        leagues: [
          {
            id: "keepers",
            name: "Keepers",
            historical: false,
            url: "/data/drop-rates/poe1/keepers.json",
          },
        ],
      })
      .mockResolvedValueOnce({ cards: [] })
      .mockResolvedValueOnce([
        {
          id: "the-unobserved-card",
          name: "The Unobserved Card",
          rewardText: "A catalog reward",
          stackSize: 5,
          fromBoss: false,
          rarity: 2,
        },
      ]);
    const queryClient = { ensureQueryData } as unknown as QueryClient;

    await expect(
      loadCardSeoRouteData(
        queryClient,
        EGame.Poe1,
        "keepers",
        "the-unobserved-card",
      ),
    ).resolves.toMatchObject({
      facts: {
        name: "The Unobserved Card",
        observedCount: undefined,
        observedRate: undefined,
      },
    });
  });

  it("returns observed facts when the card catalog is unavailable", async () => {
    const ensureQueryData = vi
      .fn()
      .mockResolvedValueOnce({
        leagues: [
          {
            id: "keepers",
            name: "Keepers",
            historical: false,
            url: "/data/drop-rates/poe1/keepers.json",
          },
        ],
      })
      .mockResolvedValueOnce({
        cards: [{ name: "A Chilling Wind", count: 12, ratio: 0.0125 }],
      })
      .mockRejectedValueOnce(new Error("Catalog unavailable"));
    const queryClient = { ensureQueryData } as unknown as QueryClient;

    await expect(
      loadCardSeoRouteData(
        queryClient,
        EGame.Poe1,
        "keepers",
        "a-chilling-wind",
      ),
    ).resolves.toEqual({
      leagueName: "Keepers",
      facts: {
        name: "A Chilling Wind",
        slug: "a-chilling-wind",
        observedCount: 12,
        observedRate: 0.0125,
      },
    });
  });
});
