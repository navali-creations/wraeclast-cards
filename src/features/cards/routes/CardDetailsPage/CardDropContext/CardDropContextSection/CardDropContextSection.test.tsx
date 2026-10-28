// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCardDropContext } from "../useCardDropContext/useCardDropContext";
import { CardDropContextSection } from "./CardDropContextSection";

vi.mock("../useCardDropContext/useCardDropContext", () => ({
  useCardDropContext: vi.fn(),
}));

const mockUseCardDropContext = vi.mocked(useCardDropContext);
const emptyTimeBuckets = { local: {}, utc: {} };

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("CardDropContextSection", () => {
  it("keeps location context visible when time context fails", () => {
    mockUseCardDropContext.mockReturnValue({
      timeBuckets: emptyTimeBuckets,
      timeBucketTotals: emptyTimeBuckets,
      locationRows: [
        {
          name: "Highgate",
          count: 4,
          lift: 1.25,
          lowSample: false,
          sampleSize: 200,
        },
      ],
      timeStatus: { error: new Error("time failed"), isLoading: false },
      locationStatus: { error: null, isLoading: false },
    });

    render(<CardDropContextSection cardName="The Test Card" />);

    expect(
      screen.getByText("Reported time-of-day context could not be loaded."),
    ).toBeTruthy();
    expect(screen.getByText("By opening location")).toBeTruthy();
    expect(screen.getByText("Highgate")).toBeTruthy();
  });

  it("keeps time context visible when location context fails", () => {
    mockUseCardDropContext.mockReturnValue({
      timeBuckets: { local: {}, utc: { 0: 2 } },
      timeBucketTotals: { local: {}, utc: { 0: 20 } },
      locationRows: [],
      timeStatus: { error: null, isLoading: false },
      locationStatus: {
        error: new Error("locations failed"),
        isLoading: false,
      },
    });

    render(<CardDropContextSection cardName="The Test Card" />);

    expect(screen.getByText("By time of day")).toBeTruthy();
    expect(
      screen.getByText(
        "Reported opening-location context could not be loaded.",
      ),
    ).toBeTruthy();
  });

  it("shows the shared empty state instead of an empty location chart", () => {
    mockUseCardDropContext.mockReturnValue({
      timeBuckets: emptyTimeBuckets,
      timeBucketTotals: emptyTimeBuckets,
      locationRows: [],
      timeStatus: { error: null, isLoading: false },
      locationStatus: { error: null, isLoading: false },
    });

    render(<CardDropContextSection cardName="The Test Card" />);

    expect(
      screen.getByText(
        /No time or opening-location context has been reported for this card/,
      ),
    ).toBeTruthy();
    expect(screen.queryByText("By opening location")).toBeNull();
  });
});
