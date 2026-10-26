// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DropRateLeague } from "../../../../../lib/dropRates";
import { StackedDecksComparisonWorkspace } from "./StackedDecksComparisonWorkspace";

const comparisonContextMock = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-router", () => ({
  Outlet: () => <div>Comparison content</div>,
}));

vi.mock(
  "../StackedDecksComparisonContext/StackedDecksComparisonContext",
  () => ({ useStackedDecksComparison: comparisonContextMock }),
);

vi.mock(
  "../../../../../components/page-content/PageContent/PageContent",
  () => ({
    PageContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  }),
);

vi.mock("../../../../../components/page-header/PageHeader/PageHeader", () => ({
  PageHeader: ({
    title,
    subtitle,
  }: {
    title: ReactNode;
    subtitle?: ReactNode;
  }) => (
    <header>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  ),
}));

vi.mock("../ComparisonControls/ComparisonControls", () => ({
  ComparisonControls: () => <div>Controls</div>,
}));

vi.mock("../ComparisonHeaderActions/ComparisonHeaderActions", () => ({
  ComparisonHeaderActions: () => <div>Actions</div>,
}));

const KEEPERS: DropRateLeague = {
  id: "keepers",
  name: "Keepers",
  historical: true,
  url: "",
  card_count: 386,
  generated_at: "",
};

const MIRAGE: DropRateLeague = {
  id: "mirage",
  name: "Mirage",
  historical: false,
  url: "",
  card_count: 386,
  generated_at: "",
};

afterEach(() => {
  cleanup();
  comparisonContextMock.mockReset();
});

describe("StackedDecksComparisonWorkspace", () => {
  it("describes the active transition using each league's observations", () => {
    comparisonContextMock.mockReturnValue({
      view: "movers",
      leagues: [MIRAGE, KEEPERS],
      selectedLeagues: [MIRAGE, KEEPERS],
      moverTransition: {
        id: "keepers:mirage",
        fromLeague: KEEPERS,
        toLeague: MIRAGE,
      },
      observationCountByLeagueId: new Map([
        ["keepers", 13_629],
        ["mirage", 49_744],
      ]),
      isLoading: false,
      hasComparableData: true,
      loadingLeagueCount: 0,
      failedLeagueNames: [],
      retryFailedLeagues: vi.fn(),
    });

    render(<StackedDecksComparisonWorkspace />);

    expect(
      screen.getByText(
        "Comparing Keepers (~13k observations) with Mirage (~49k observations)",
      ),
    ).toBeTruthy();
    expect(screen.queryByText(/Players saw/)).toBeNull();
  });

  it("keeps comparison content available when only one selected dataset fails", () => {
    const retryFailedLeagues = vi.fn();
    comparisonContextMock.mockReturnValue({
      view: "matrix",
      leagues: [MIRAGE, KEEPERS],
      selectedLeagues: [MIRAGE, KEEPERS],
      moverTransition: undefined,
      observationCountByLeagueId: new Map(),
      isLoading: false,
      hasComparableData: true,
      loadingLeagueCount: 0,
      failedLeagueNames: ["Ancestors"],
      retryFailedLeagues,
    });

    render(<StackedDecksComparisonWorkspace />);

    expect(screen.getByRole("alert").textContent).toContain(
      "Could not load: Ancestors",
    );
    expect(screen.getByText("Comparison content")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(retryFailedLeagues).toHaveBeenCalledTimes(1);
  });

  it("shows a retryable terminal state instead of empty comparison content", () => {
    const retryFailedLeagues = vi.fn();
    comparisonContextMock.mockReturnValue({
      view: "matrix",
      leagues: [MIRAGE, KEEPERS],
      selectedLeagues: [MIRAGE, KEEPERS],
      moverTransition: undefined,
      observationCountByLeagueId: new Map(),
      isLoading: false,
      hasComparableData: false,
      loadingLeagueCount: 0,
      failedLeagueNames: ["Mirage", "Keepers"],
      retryFailedLeagues,
    });

    render(<StackedDecksComparisonWorkspace />);

    expect(screen.queryByText("Comparison content")).toBeNull();
    expect(screen.getByRole("alert").textContent).toContain(
      "At least two league datasets are required",
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Retry failed datasets" }),
    );
    expect(retryFailedLeagues).toHaveBeenCalledTimes(1);
  });
});
