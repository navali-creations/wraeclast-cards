// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HistoryView } from "./HistoryView";

const comparisonContextMock = vi.hoisted(() => vi.fn());

vi.mock(
  "../StackedDecksComparisonContext/StackedDecksComparisonContext",
  () => ({ useStackedDecksComparison: comparisonContextMock }),
);

vi.mock(
  "../../../components/StackedDecksResults/CardNamePreview/CardNamePreview",
  () => ({
    CardNamePreview: ({ name }: { name: string }) => <span>{name}</span>,
  }),
);

afterEach(() => {
  cleanup();
  comparisonContextMock.mockReset();
});

describe("HistoryView", () => {
  it("repairs a stale card query and explains values below the sample limit", async () => {
    const setHistoryCardName = vi.fn();
    comparisonContextMock.mockReturnValue({
      rows: [
        {
          key: "the-doctor",
          name: "The Doctor",
          values: [
            {
              leagueId: "mirage",
              leagueName: "Mirage",
              value: 0.01,
              count: 4,
              isEligible: false,
              relativeDelta: null,
              difference: null,
              isBaseline: true,
            },
          ],
        },
      ],
      historyCardName: "Removed Card",
      setHistoryCardName,
      baselineLeague: { name: "Mirage" },
      metric: "players-saw",
      verified: false,
    });

    render(<HistoryView />);

    expect(screen.getByText("Below sample")).toBeTruthy();
    await waitFor(() =>
      expect(setHistoryCardName).toHaveBeenCalledWith("The Doctor", true),
    );
  });
});
