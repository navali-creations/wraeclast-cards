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
import type {
  ComparisonLeagueValue,
  ComparisonRow,
} from "../../useStackedDecksComparisonData/useStackedDecksComparisonData.utils";
import { MoversTable } from "./MoversTable";

const comparisonContextMock = vi.hoisted(() => vi.fn());

vi.mock(
  "../../StackedDecksComparisonContext/StackedDecksComparisonContext",
  () => ({ useStackedDecksComparison: comparisonContextMock }),
);

vi.mock(
  "../../../../components/StackedDecksResults/CardNamePreview/CardNamePreview",
  () => ({
    CardNamePreview: ({ cardId, name }: { cardId: string; name: string }) => (
      <a href={`/cards/${cardId}`}>{name}</a>
    ),
  }),
);

function leagueValue(leagueId: string, value: number): ComparisonLeagueValue {
  return {
    leagueId,
    leagueName: leagueId,
    value,
    count: 100,
    isEligible: true,
    relativeDelta: null,
    difference: null,
    isBaseline: leagueId === "mirage",
  };
}

function comparisonRow(index: number): ComparisonRow {
  const fromValue = leagueValue("keepers", 0.01);
  const toValue = leagueValue("mirage", 0.01 + index / 10_000);

  return {
    key: `card-${index}`,
    name: `Card ${index}`,
    values: [toValue, fromValue],
    baselineValue: toValue,
    strongestValue: undefined,
  };
}

function visibleCardNames() {
  const table = screen.getByRole("table");

  return within(table)
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[1].textContent);
}

function StatefulMoversTable({
  context,
}: {
  context: Record<string, unknown>;
}) {
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

  return <MoversTable />;
}

afterEach(cleanup);

describe("MoversTable", () => {
  it("paginates every comparable card without showing reported counts", () => {
    const context = {
      rows: Array.from({ length: 25 }, (_, index) => comparisonRow(index + 1)),
      moverTransition: {
        id: "keepers:mirage",
        fromLeague: {
          id: "keepers",
          name: "Keepers",
          historical: true,
          url: "",
          card_count: 25,
          generated_at: "",
        },
        toLeague: {
          id: "mirage",
          name: "Mirage",
          historical: false,
          url: "",
          card_count: 25,
          generated_at: "",
        },
      },
      metric: "players-saw",
      minimumObservations: 0,
    };

    render(<StatefulMoversTable context={context} />);

    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(21);
    expect(within(table).getAllByRole("row")[1].className).toContain(
      "wc-stacked-decks-row-enter",
    );
    const cardLinks = within(table).getAllByRole("link");
    expect(cardLinks).toHaveLength(20);
    expect(cardLinks[0].getAttribute("href")).toMatch(/^\/cards\//);
    expect(
      within(table).getByRole("columnheader", { name: "#" }).className,
    ).toContain("w-10");
    expect(within(table).getAllByRole("cell")[0].className).toContain(
      "text-xs tabular-nums text-(--wc-text-70)",
    );
    expect(screen.getByText(/Showing/).textContent).toBe(
      "Showing 1–20 of 25 cards",
    );
    expect(screen.queryByText(/reported drops/i)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(within(table).getAllByRole("row")).toHaveLength(6);
    expect(within(table).getAllByRole("cell")[0].textContent).toBe("21");
    expect(screen.getByText(/Showing/).textContent).toBe(
      "Showing 21–25 of 25 cards",
    );
  });

  it("sorts each sortable data column from its header", () => {
    const context = {
      rows: [comparisonRow(3), comparisonRow(1), comparisonRow(2)],
      moverTransition: {
        id: "keepers:mirage",
        fromLeague: {
          id: "keepers",
          name: "Keepers",
          historical: true,
          url: "",
          card_count: 3,
          generated_at: "",
        },
        toLeague: {
          id: "mirage",
          name: "Mirage",
          historical: false,
          url: "",
          card_count: 3,
          generated_at: "",
        },
      },
      metric: "players-saw",
      minimumObservations: 0,
    };

    render(<StatefulMoversTable context={context} />);

    for (const name of ["Card", "Keepers", "Mirage", "Change"]) {
      expect(
        screen.getByRole("columnheader", { name }).getAttribute("tabindex"),
      ).toBe("0");
    }
    expect(
      screen
        .getByRole("columnheader", { name: "Card" })
        .querySelector("svg")
        ?.classList.contains("order-last"),
    ).toBe(true);

    fireEvent.click(screen.getByRole("columnheader", { name: "Card" }));
    expect(visibleCardNames()).toEqual(["Card 1", "Card 2", "Card 3"]);
    expect(
      screen
        .getByRole("columnheader", { name: "Card" })
        .getAttribute("aria-sort"),
    ).toBe("ascending");
    expect(
      within(screen.getByRole("table")).getAllByRole("cell")[1].className,
    ).toContain("xs:bg-(--wc-skeleton-highlight)");

    fireEvent.click(screen.getByRole("columnheader", { name: "Card" }));
    expect(visibleCardNames()).toEqual(["Card 3", "Card 2", "Card 1"]);

    for (const name of ["Keepers", "Mirage", "Change"]) {
      fireEvent.click(screen.getByRole("columnheader", { name }));
      expect(
        screen.getByRole("columnheader", { name }).getAttribute("aria-sort"),
      ).not.toBeNull();
    }
  });

  it("returns to the last valid page when filtering shrinks the result", () => {
    const transition = {
      id: "keepers:mirage",
      fromLeague: {
        id: "keepers",
        name: "Keepers",
        historical: true,
        url: "",
        card_count: 25,
        generated_at: "",
      },
      toLeague: {
        id: "mirage",
        name: "Mirage",
        historical: false,
        url: "",
        card_count: 25,
        generated_at: "",
      },
    };
    const context = {
      rows: Array.from({ length: 25 }, (_, index) => comparisonRow(index + 1)),
      moverTransition: transition,
      metric: "players-saw",
      minimumObservations: 0,
    };
    const view = render(<StatefulMoversTable context={context} />);

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getByText(/Showing/).textContent).toContain("21–25");

    view.rerender(
      <StatefulMoversTable
        context={{ ...context, rows: [comparisonRow(1), comparisonRow(2)] }}
      />,
    );

    expect(screen.getByText(/Showing/).textContent).toBe(
      "Showing 1–2 of 2 cards",
    );
  });
});
