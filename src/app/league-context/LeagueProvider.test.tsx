// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeagueProvider } from "./LeagueProvider";
import { useLeagueContext } from "./useLeagueContext";

const mocks = vi.hoisted(() => ({
  params: {} as { league?: string },
  useGameDropRates: vi.fn(),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useParams: () => mocks.params,
  };
});

vi.mock("../../lib/dropRates", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../lib/dropRates")>();
  return {
    ...actual,
    useGameDropRates: mocks.useGameDropRates,
  };
});

vi.mock("../game-context", () => ({
  useGameContext: () => ({ game: "poe1" }),
}));

const LEAGUES = [
  {
    id: "standard",
    name: "Standard",
    historical: false,
    url: "",
    card_count: 0,
    generated_at: "",
  },
  {
    id: "keepers",
    name: "Keepers",
    historical: true,
    url: "/data/drop-rates/poe1/keepers.json",
    card_count: 10,
    generated_at: "",
  },
];

function LeagueValue() {
  const { selectedLeague } = useLeagueContext();
  return <span>{selectedLeague.name}</span>;
}

describe("LeagueProvider hydration preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    mocks.params = {};
    mocks.useGameDropRates.mockReturnValue({
      data: { leagues: LEAGUES },
      isLoading: false,
      error: null,
    });
  });

  it("applies the stored league before the browser paints", () => {
    localStorage.setItem(
      "leagueSlugByGame",
      JSON.stringify({ poe1: "keepers" }),
    );

    render(
      <LeagueProvider>
        <LeagueValue />
      </LeagueProvider>,
    );

    expect(screen.getByText("Keepers")).toBeTruthy();
  });

  it("lets an explicit route league override storage", () => {
    localStorage.setItem(
      "leagueSlugByGame",
      JSON.stringify({ poe1: "keepers" }),
    );
    mocks.params = { league: "standard" };

    render(
      <LeagueProvider>
        <LeagueValue />
      </LeagueProvider>,
    );

    expect(screen.getByText("Standard")).toBeTruthy();
  });
});
