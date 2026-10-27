// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DropRateCard, LeagueDropRates } from "../../../../lib/dropRates";
import type { Card } from "../../../cards/types";
import { useFeaturedCardEntries } from "./useFeaturedCardEntries";

const mocks = vi.hoisted(() => ({
  selectedLeagueId: "league-one",
  useCardsQuery: vi.fn(),
  useLeagueDropLocations: vi.fn(),
  useLeagueDropRates: vi.fn(),
  useLeagueTimeBuckets: vi.fn(),
}));

vi.mock("../../../../app/game-context", () => ({
  useGameContext: () => ({ game: "poe1" }),
}));

vi.mock("../../../../app/league-context", () => ({
  useLeagueContext: () => ({
    selectedLeagueId: mocks.selectedLeagueId,
    isLoadingLeagues: false,
    leaguesError: null,
  }),
}));

vi.mock("../../../../lib/dropRates", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../../lib/dropRates")>()),
  useLeagueDropLocations: mocks.useLeagueDropLocations,
  useLeagueDropRates: mocks.useLeagueDropRates,
  useLeagueTimeBuckets: mocks.useLeagueTimeBuckets,
}));

vi.mock("../../../cards/hooks", () => ({
  useCardsQuery: mocks.useCardsQuery,
}));

function card(
  name: string,
  rarity: Card["rarity"],
  imageUrl = `${name}.png`,
): Card {
  return {
    id: name,
    name,
    imageUrl,
    frameUrl: "frame.png",
    separatorUrl: "separator.png",
    rewardText: "Reward",
    rewardHtml: "Reward",
    rewardSearchText: "reward",
    rewardTags: [],
    stackSize: 1,
    dropLocations: [],
    rarity,
    fromBoss: false,
    isDisabled: false,
  };
}

function dropRateCard(
  name: string,
  count: number,
  ratio: number,
): DropRateCard {
  return {
    name,
    count,
    ratio,
    verified_count: 0,
    verified_ratio: 0,
    reference_estimated_chance: null,
    seen_vs_reference: null,
    verified_seen_vs_reference: null,
    reference_weight: null,
    community_estimated_weight: null,
    verified_community_estimated_weight: null,
    community_estimated_weight_delta_vs_reference: null,
    verified_community_estimated_weight_delta_vs_reference: null,
  };
}

function leagueData(id: string, cards: DropRateCard[]): LeagueDropRates {
  return {
    schema_version: 9,
    generated_at: "2026-10-27T00:00:00.000Z",
    game: "poe1",
    league: { id, name: id, historical: false },
    reference: null,
    context: null,
    cards,
  };
}

describe("useFeaturedCardEntries", () => {
  beforeEach(() => {
    mocks.selectedLeagueId = "league-one";
    mocks.useCardsQuery.mockReturnValue({
      data: [
        card("Observed common", 4),
        card("Observed uncommon", 3),
        card("Observed without image", 2, ""),
        card("Unseen rare", 1),
        card("Second-league rare", 1),
      ],
      isLoading: false,
      error: null,
    });
    mocks.useLeagueDropRates.mockReturnValue({
      data: leagueData("league-one", [
        dropRateCard("Observed common", 5, 0.05),
        dropRateCard("Observed uncommon", 2, 0.02),
        dropRateCard("Observed without image", 1, 0.01),
        dropRateCard("Unseen rare", 0, 0),
      ]),
      isLoading: false,
      error: null,
    });
    mocks.useLeagueTimeBuckets.mockReturnValue({ data: undefined });
    mocks.useLeagueDropLocations.mockReturnValue({ data: undefined });
  });

  it("features only image-backed cards observed in the selected league", () => {
    const { result } = renderHook(() => useFeaturedCardEntries());

    expect(result.current.entries.map((entry) => entry.card.name)).toEqual([
      "Observed common",
      "Observed uncommon",
    ]);
    expect(result.current.entries.map((entry) => entry.rate)).toEqual([
      "5%",
      "2%",
    ]);
  });

  it("reselects featured cards when the active league changes", () => {
    const { result, rerender } = renderHook(() => useFeaturedCardEntries());

    mocks.selectedLeagueId = "league-two";
    mocks.useLeagueDropRates.mockReturnValue({
      data: leagueData("league-two", [
        dropRateCard("Second-league rare", 1, 0.001),
      ]),
      isLoading: false,
      error: null,
    });
    rerender();

    expect(mocks.useLeagueDropRates).toHaveBeenLastCalledWith(
      "poe1",
      "league-two",
    );
    expect(result.current.entries.map((entry) => entry.card.name)).toEqual([
      "Second-league rare",
    ]);
  });
});
