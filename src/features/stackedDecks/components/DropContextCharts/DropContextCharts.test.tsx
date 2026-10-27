// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { DropTimeMiniChart } from "./DropTimeMiniChart";

afterEach(cleanup);

describe("drop context charts", () => {
  it("renders eight labelled pairs for card reports and overall activity", () => {
    const markup = renderToStaticMarkup(
      <DropTimeMiniChart
        utcTimeBuckets={{ 0: 2, 180: 8 }}
        localTimeBuckets={{ 0: 3, 180: 7 }}
        utcTotalBuckets={{ 0: 200, 180: 700, 360: 100 }}
        localTotalBuckets={{ 0: 300, 180: 600, 360: 100 }}
      />,
    );

    expect(markup).toContain(
      "Compare when this card was reported with all reported cards that include time data",
    );
    expect(markup).toContain("gap-0.5");
    expect(markup.match(/w-2\.5/g)).toHaveLength(8);
    expect(markup.match(/rounded-t-sm/g)).toHaveLength(16);
    expect(markup.match(/class="w-1 rounded-t-sm/g)).toHaveLength(16);
    for (const hour of ["00", "03", "06", "09", "12", "15", "18", "21"]) {
      expect(markup).toContain(`>${hour}</span>`);
    }
  });

  it("compares card and overall timing distributions in the hover popover", () => {
    render(
      <DropTimeMiniChart
        utcTimeBuckets={{ 0: 2, 180: 8 }}
        localTimeBuckets={{ 0: 3, 180: 7 }}
        utcTotalBuckets={{ 0: 200, 180: 700, 360: 100 }}
        localTotalBuckets={{ 0: 300, 180: 600, 360: 100 }}
      />,
    );

    fireEvent.mouseEnter(
      screen.getByRole("button", {
        name: /Compare when this card was reported.*using global time/,
      }),
    );

    expect(screen.getByRole("tooltip")).toBeTruthy();
    expect(screen.getByText("When drops were reported")).toBeTruthy();
    expect(screen.getByText("10 reports")).toBeTruthy();
    expect(
      screen.getByText(/compare when this card was reported/),
    ).toBeTruthy();
    expect(screen.getByText(/not that time changes drop chance/)).toBeTruthy();
    expect(screen.getByText("This card")).toBeTruthy();
    expect(screen.getByText("All reported cards with time data")).toBeTruthy();
    expect(screen.getByText("Global (UTC)")).toBeTruthy();
    expect(screen.getByText("Player timezone")).toBeTruthy();
    expect(screen.getAllByText("00")).toHaveLength(3);
    expect(screen.queryByText(/×/)).toBeNull();
  });

  it("keeps legacy player-time data visible when global time is unavailable", () => {
    render(
      <DropTimeMiniChart
        utcTimeBuckets={{}}
        localTimeBuckets={{ 0: 3, 180: 7 }}
        utcTotalBuckets={{}}
        localTotalBuckets={{ 0: 300, 180: 700 }}
      />,
    );

    const chart = screen.getByRole("button", {
      name: /using each player’s timezone/,
    });
    expect(chart.textContent).toContain("00");

    fireEvent.mouseEnter(chart);
    expect(screen.getByText("10 reports")).toBeTruthy();
    expect(screen.queryByText("Global (UTC)")).toBeNull();
    expect(screen.getByText("Player timezone")).toBeTruthy();
  });
});
