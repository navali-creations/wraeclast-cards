// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { buildNormalizedLocationData } from "../../../../stackedDecks/components/DropContextCharts/dropContext.utils";
import { CardTimeContextChart } from "./CardTimeContextChart/CardTimeContextChart";
import { LocationContextChart } from "./LocationContextChart/LocationContextChart";

afterEach(cleanup);

describe("card drop context charts", () => {
  it("renders the full 15-minute UTC distribution and switches to player time", async () => {
    render(
      <CardTimeContextChart
        cardBuckets={{ utc: { 0: 2 }, local: { 60: 2 } }}
        totalBuckets={{ utc: { 0: 20 }, local: { 60: 40 } }}
      />,
    );

    expect(
      screen.getByRole("figure", { name: /Global \(UTC\) distribution/ }),
    ).toBeTruthy();
    expect(document.querySelectorAll("[data-time-bucket]")).toHaveLength(96);
    expect(screen.getByText("Share")).toBeTruthy();
    expect(screen.getByText("Time of day")).toBeTruthy();
    expect(document.querySelector(".overflow-x-auto")).toBeNull();
    const bucketAnchors = document.querySelectorAll("[data-time-bucket]");
    expect(bucketAnchors[0]?.getAttribute("style")).toContain("height: 100%");
    expect(bucketAnchors[1]?.getAttribute("style")).toContain("height: 1px");
    expect(
      screen.getByRole("button", { name: "About time-of-day reporting" }),
    ).toBeTruthy();
    expect(screen.getByText(/reporting patterns/i)).toBeTruthy();
    const plot = screen.getByTestId("time-distribution-plot");
    const hoverLayer = screen.getByTestId("time-distribution-hover-layer");
    const chartBounds = () => ({
      bottom: 128,
      height: 128,
      left: 0,
      right: 960,
      top: 0,
      width: 960,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });
    Object.defineProperty(plot, "getBoundingClientRect", {
      value: chartBounds,
    });
    Object.defineProperty(hoverLayer, "getBoundingClientRect", {
      value: chartBounds,
    });
    fireEvent.pointerMove(hoverLayer, { clientX: 5, clientY: 100 });
    await waitFor(() => {
      expect(
        screen
          .getAllByRole("tooltip", { hidden: true })
          .some((tooltip) =>
            tooltip.textContent?.includes("00:00–00:15 · Global (UTC)"),
          ),
      ).toBe(true);
    });

    fireEvent.wheel(plot, {
      clientX: 0,
      deltaY: -100,
    });

    expect(document.querySelectorAll("[data-time-bucket]")).toHaveLength(88);
    expect(screen.getByTestId("time-range-overview")).toBeTruthy();
    const panControl = screen.getByRole("slider", {
      name: "Pan visible time window",
    });
    fireEvent.keyDown(panControl, { key: "ArrowRight" });
    expect(screen.getByText("01:00")).toBeTruthy();
    fireEvent.keyDown(
      screen.getByRole("slider", {
        name: "Adjust visible time window end",
      }),
      { key: "ArrowLeft" },
    );
    expect(document.querySelectorAll("[data-time-bucket]")).toHaveLength(84);

    fireEvent.click(screen.getByRole("button", { name: "Player time" }));

    expect(
      screen.getByRole("figure", { name: /Player time distribution/ }),
    ).toBeTruthy();
  });

  it("supports dragging the overview window to pan the chart", () => {
    render(
      <CardTimeContextChart
        cardBuckets={{ utc: { 0: 2 }, local: {} }}
        totalBuckets={{ utc: { 0: 20 }, local: {} }}
      />,
    );

    const plot = screen.getByTestId("time-distribution-plot");
    Object.defineProperty(plot, "getBoundingClientRect", {
      value: () => ({ height: 128, left: 0, width: 960 }),
    });
    const panControl = screen.getByRole("slider", {
      name: "Pan visible time window",
    });
    fireEvent.wheel(plot, {
      clientX: 0,
      deltaY: -100,
    });
    const overview = screen.getByTestId("time-range-overview");
    Object.defineProperties(overview, {
      getBoundingClientRect: {
        value: () => ({ height: 40, left: 0, width: 960 }),
      },
      hasPointerCapture: { value: () => true },
      releasePointerCapture: { value: () => undefined },
      setPointerCapture: { value: () => undefined },
    });
    fireEvent.pointerDown(panControl, { clientX: 0, pointerId: 1 });
    expect(document.documentElement.style.cursor).toBe("grabbing");
    fireEvent.pointerMove(overview, { clientX: 50, pointerId: 1 });
    fireEvent.pointerUp(overview, { clientX: 50, pointerId: 1 });
    expect(document.documentElement.style.cursor).toBe("");

    expect(screen.getByText("01:00")).toBeTruthy();

    fireEvent.pointerDown(
      screen.getByRole("slider", {
        name: "Adjust visible time window start",
      }),
      { clientX: 50, pointerId: 2 },
    );
    expect(document.documentElement.style.cursor).toBe("ew-resize");
    fireEvent.pointerUp(overview, { clientX: 50, pointerId: 2 });
    expect(document.documentElement.style.cursor).toBe("");
  });

  it("renders normalized locations with visible samples and an outside label", () => {
    const rows = buildNormalizedLocationData(
      { Highgate: 50, "The Menagerie": 1 },
      { Highgate: 100, "The Menagerie": 1_000 },
      51,
    );
    render(<LocationContextChart cardName="A Dab of Ink" rows={rows} />);

    expect(screen.getByText("By opening location")).toBeTruthy();
    expect(screen.getByText("50 card reports / 100 openings")).toBeTruthy();
    expect(screen.getByText("1 card report / 1,000 openings")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "About opening-location reporting",
      }),
    ).toBeTruthy();
    expect(screen.getByText("1.00")).toBeTruthy();
    expect(screen.queryByText("usual")).toBeNull();
    expect(
      screen.getByRole("img", {
        name: /A Dab of Ink reporting rate relative to its usual rate/,
      }),
    ).toBeTruthy();
  });
});
