// @vitest-environment jsdom

import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnimatedStatValue } from "./AnimatedStatValue";

const mocks = vi.hoisted(() => ({
  animate: vi.fn(),
  matchMedia: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("motion", () => ({
  animate: mocks.animate,
}));

beforeEach(() => {
  vi.stubGlobal("matchMedia", mocks.matchMedia);
  mocks.matchMedia.mockReturnValue({ matches: false });
  mocks.animate.mockReturnValue({ stop: mocks.stop });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe("AnimatedStatValue", () => {
  it("counts from zero to the compact formatted value", () => {
    const { container, unmount } = render(
      <AnimatedStatValue unavailable={false} value={9_600_000} />,
    );
    const valueElement = container.querySelector("[data-animated-stat-value]");
    const options = mocks.animate.mock.calls[0]?.[2] as {
      onUpdate: (latest: number) => void;
    };

    expect(valueElement?.textContent).toBe("0");

    act(() => options.onUpdate(4_800_000));
    expect(valueElement?.textContent).toBe("4.8M");

    act(() => options.onUpdate(9_600_000));
    expect(valueElement?.textContent).toBe("9.6M");

    unmount();
    expect(mocks.stop).toHaveBeenCalledOnce();
  });

  it("shows the final value without animating when motion is reduced", () => {
    mocks.matchMedia.mockReturnValue({ matches: true });

    const { container } = render(
      <AnimatedStatValue unavailable={false} value={464} />,
    );

    expect(
      container.querySelector("[data-animated-stat-value]")?.textContent,
    ).toBe("464");
    expect(mocks.animate).not.toHaveBeenCalled();
  });

  it("does not animate unavailable values", () => {
    const { container } = render(
      <AnimatedStatValue unavailable value={undefined} />,
    );

    expect(
      container.querySelector("[data-animated-stat-value]")?.textContent,
    ).toBe("N/A");
    expect(mocks.animate).not.toHaveBeenCalled();
  });
});
