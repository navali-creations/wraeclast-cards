// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TimeChartPopover } from "./TimeChartPopover";

afterEach(cleanup);

describe("TimeChartPopover", () => {
  it("keeps the popover inside the bottom of the viewport", () => {
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 240,
    });
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 320,
    });
    const bucket = {
      activityShare: 0.2,
      cardShare: 0.1,
      count: 2,
      minute: 0,
      sampleSize: 20,
    };
    const view = render(
      <TimeChartPopover
        bucket={bucket}
        label="Global (UTC)"
        pointerX={50}
        pointerY={40}
      />,
    );
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    Object.defineProperty(tooltip, "getBoundingClientRect", {
      value: () => ({ height: 200, width: 200 }),
    });

    view.rerender(
      <TimeChartPopover
        bucket={bucket}
        label="Global (UTC)"
        pointerX={51}
        pointerY={41}
      />,
    );

    expect(tooltip.style.top).toBe("32px");
    expect(tooltip.style.left).toBe("65px");
  });
});
