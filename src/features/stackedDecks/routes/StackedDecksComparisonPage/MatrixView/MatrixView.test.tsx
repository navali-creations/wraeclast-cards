// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DropRateLeague } from "../../../../../lib/dropRates";
import type {
  ComparisonLeagueValue,
  ComparisonRow,
} from "../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import { MatrixView } from "./MatrixView";

const comparisonContextMock = vi.hoisted(() => vi.fn());

vi.mock(
  "../StackedDecksComparisonContext/StackedDecksComparisonContext",
  () => ({ useStackedDecksComparison: comparisonContextMock }),
);

vi.mock(
  "../../../components/StackedDecksResults/CardNamePreview/CardNamePreview",
  () => ({
    CardNamePreview: ({ cardId, name }: { cardId: string; name: string }) => (
      <a href={`/cards/${cardId}`}>{name}</a>
    ),
  }),
);

const LEAGUES: DropRateLeague[] = [
  {
    id: "mirage",
    name: "Mirage",
    historical: false,
    url: "",
    card_count: 101,
    generated_at: "",
  },
  {
    id: "keepers",
    name: "Keepers",
    historical: true,
    url: "",
    card_count: 101,
    generated_at: "",
  },
];

function leagueValue(
  league: DropRateLeague,
  value: number,
  isBaseline: boolean,
): ComparisonLeagueValue {
  return {
    leagueId: league.id,
    leagueName: league.name,
    value,
    count: 100,
    isEligible: true,
    relativeDelta: isBaseline ? null : 0.1,
    difference: isBaseline ? null : 0.001,
    isBaseline,
  };
}

function comparisonRow(index: number): ComparisonRow {
  const baselineValue = leagueValue(LEAGUES[0], 0.01, true);
  const comparisonValue = leagueValue(LEAGUES[1], 0.011, false);

  return {
    key: `card-${index}`,
    name: `Card ${index.toString().padStart(3, "0")}`,
    values: [baselineValue, comparisonValue],
    baselineValue,
    strongestValue: comparisonValue,
  };
}

function StatefulMatrixView({ context }: { context: Record<string, unknown> }) {
  const [sortBy, setSortBy] = useState<string>();
  const [sortAscending, setSortAscending] = useState<boolean>();
  const [page, setPage] = useState(1);
  comparisonContextMock.mockReturnValue({
    ...context,
    sortBy,
    sortAscending,
    page,
    setTableSort(column: string | undefined, ascending?: boolean) {
      setSortBy(column);
      setSortAscending(ascending);
      setPage(1);
    },
    setPage,
  });

  return <MatrixView />;
}

afterEach(() => {
  cleanup();
  comparisonContextMock.mockReset();
  vi.unstubAllGlobals();
});

describe("MatrixView", () => {
  it("paginates every card without the row-limit message or header sublabels", () => {
    const context = {
      leagues: LEAGUES,
      selectedLeagues: LEAGUES,
      selectedLeagueIds: LEAGUES.map((league) => league.id),
      baselineLeagueId: "mirage",
      rows: Array.from({ length: 101 }, (_, index) => comparisonRow(index + 1)),
      metric: "players-saw",
      verified: false,
    };

    render(<StatefulMatrixView context={context} />);

    expect(screen.queryByText("Newest → oldest")).toBeNull();
    expect(screen.queryByText(/Showing first/)).toBeNull();

    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(21);
    expect(within(table).getAllByRole("row")[1].className).toContain(
      "wc-stacked-decks-row-enter",
    );
    expect(within(table).getAllByRole("link")).toHaveLength(20);
    expect(
      within(table)
        .getByRole("link", { name: "Card 001" })
        .getAttribute("href"),
    ).toBe("/cards/card-001");
    expect(document.querySelectorAll("details")).toHaveLength(0);
    expect(screen.getByText(/Showing/).textContent).toBe(
      "Showing 1–20 of 101 cards",
    );
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((header) => header.textContent),
    ).toEqual(["Card", "Mirage", "Keepers"]);
    expect(
      within(table)
        .getByRole("columnheader", { name: "Card" })
        .querySelector("svg")
        ?.classList.contains("order-last"),
    ).toBe(true);
    expect(within(table).getAllByRole("cell")[0].className).toContain(
      "xs:bg-(--wc-skeleton-highlight)",
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(within(table).getAllByRole("cell")[0].textContent).toBe("Card 021");
    expect(screen.getByText(/Showing/).textContent).toBe(
      "Showing 21–40 of 101 cards",
    );
  });

  it("renders one mobile representation and exposes matrix sorting", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    );
    const context = {
      leagues: LEAGUES,
      selectedLeagues: LEAGUES,
      selectedLeagueIds: LEAGUES.map((league) => league.id),
      baselineLeagueId: "mirage",
      rows: [comparisonRow(1), comparisonRow(2)],
      metric: "players-saw",
      verified: false,
    };

    render(<StatefulMatrixView context={context} />);

    expect(screen.queryByRole("table")).toBeNull();
    expect(document.querySelectorAll("details")).toHaveLength(2);

    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "keepers" },
    });
    expect((screen.getByLabelText("Sort by") as HTMLSelectElement).value).toBe(
      "keepers",
    );
  });
});
