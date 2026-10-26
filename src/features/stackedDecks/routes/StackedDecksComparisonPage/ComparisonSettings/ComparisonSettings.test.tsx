// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DropRateLeague } from "../../../../../lib/dropRates";
import { getComparisonTransitions } from "../useStackedDecksComparisonRouteState/useStackedDecksComparisonRouteState.utils";
import { ComparisonSettings } from "./ComparisonSettings";

const comparisonContextMock = vi.hoisted(() => vi.fn());

vi.mock(
  "../StackedDecksComparisonContext/StackedDecksComparisonContext",
  () => ({ useStackedDecksComparison: comparisonContextMock }),
);

const LEAGUES: DropRateLeague[] = [
  {
    id: "mirage",
    name: "Mirage",
    historical: false,
    url: "",
    card_count: 1,
    generated_at: "",
  },
  {
    id: "keepers",
    name: "Keepers",
    historical: true,
    url: "",
    card_count: 1,
    generated_at: "",
  },
  {
    id: "ancestors",
    name: "Ancestors",
    historical: true,
    url: "",
    card_count: 1,
    generated_at: "",
  },
];

afterEach(() => {
  cleanup();
  comparisonContextMock.mockReset();
});

describe("ComparisonSettings", () => {
  it("selects the from and to leagues independently in newest-first order", () => {
    const setMoverTransitionId = vi.fn();
    const moverTransitions = getComparisonTransitions(
      LEAGUES,
      LEAGUES.map((league) => league.id),
    );

    comparisonContextMock.mockReturnValue({
      leagues: LEAGUES,
      selectedLeagues: LEAGUES,
      selectedLeagueIds: LEAGUES.map((league) => league.id),
      baselineLeagueId: "mirage",
      moverTransitions,
      moverTransition: moverTransitions[0],
      view: "movers",
      metric: "players-saw",
      verified: false,
      minimumObservations: 0,
      setMetric: vi.fn(),
      setBaselineLeagueId: vi.fn(),
      setMoverTransitionId,
      setVerified: vi.fn(),
      setMinimumObservations: vi.fn(),
      toggleLeague: vi.fn(),
      selectAllLeagues: vi.fn(),
    });

    render(<ComparisonSettings />);

    expect(screen.queryByRole("button", { name: /verified/i })).toBeNull();

    const fromSelect = screen.getByRole("combobox", {
      name: "From league",
    });
    const toSelect = screen.getByRole("combobox", { name: "To league" });

    expect(
      within(fromSelect)
        .getAllByRole("option")
        .map((option) => (option as HTMLOptionElement).value),
    ).toEqual(["mirage", "keepers", "ancestors"]);
    expect((fromSelect as HTMLSelectElement).value).toBe("keepers");
    expect((toSelect as HTMLSelectElement).value).toBe("mirage");
    expect(
      (
        within(fromSelect).getByRole("option", {
          name: "Mirage",
        }) as HTMLOptionElement
      ).disabled,
    ).toBe(true);
    expect(
      (
        within(toSelect).getByRole("option", {
          name: "Keepers",
        }) as HTMLOptionElement
      ).disabled,
    ).toBe(true);

    fireEvent.change(fromSelect, { target: { value: "ancestors" } });
    fireEvent.change(toSelect, { target: { value: "ancestors" } });

    expect(setMoverTransitionId).toHaveBeenNthCalledWith(1, "ancestors:mirage");
    expect(setMoverTransitionId).toHaveBeenNthCalledWith(
      2,
      "keepers:ancestors",
    );
  });
});
