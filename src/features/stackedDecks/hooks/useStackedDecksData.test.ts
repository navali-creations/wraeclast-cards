// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LeagueDropRates } from "../../../lib/dropRates";
import { useStackedDecksData } from "./useStackedDecksData";

const mocks = vi.hoisted(() => ({
  useLeagueDropRates: vi.fn(),
  useLeagueTimeBuckets: vi.fn(),
}));

vi.mock("../../../app/game-context", () => ({
  useGameContext: () => ({ game: "poe1" }),
}));

vi.mock("../../../app/league-context", () => ({
  useLeagueContext: () => ({
    selectedLeague: { id: "league-id", name: "Allflame" },
    selectedLeagueId: "league-id",
    isLoadingLeagues: false,
    leaguesError: null,
  }),
}));

vi.mock("../../../lib/dropRates", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../lib/dropRates")>()),
  useLeagueDropRates: mocks.useLeagueDropRates,
  useLeagueTimeBuckets: mocks.useLeagueTimeBuckets,
}));

const leagueData: LeagueDropRates = {
  schema_version: 9,
  generated_at: "2026-10-27T00:00:00.000Z",
  game: "poe1",
  league: { id: "league-id", name: "Allflame", historical: false },
  reference: null,
  context: {
    time_buckets_url: "poe1/league-id.time-buckets.json",
    locations_url: "poe1/league-id.locations.json",
  },
  cards: [],
};

describe("useStackedDecksData", () => {
  beforeEach(() => {
    mocks.useLeagueDropRates.mockReturnValue({
      data: leagueData,
      isLoading: false,
      error: null,
    });
    mocks.useLeagueTimeBuckets.mockReturnValue({
      data: {
        observed_total: 0,
        totals: { utc: {}, local: {} },
        cards: {},
      },
      isLoading: false,
      error: null,
    });
  });

  it("keeps the base table available while linked time buckets are loading", () => {
    mocks.useLeagueTimeBuckets.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useStackedDecksData());

    expect(result.current.isLoading).toBe(false);
  });

  it("keeps the base table available when supplemental time buckets fail", () => {
    const contextError = new Error("Context unavailable");
    mocks.useLeagueTimeBuckets.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: contextError,
    });

    const { result } = renderHook(() => useStackedDecksData());

    expect(result.current.error).toBeNull();
  });
});
