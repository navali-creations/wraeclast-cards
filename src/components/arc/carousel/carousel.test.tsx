// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Carousel } from "./Carousel";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Carousel", () => {
  it("renders wrapped neighbours and moves backward through the leading clone", () => {
    render(
      <Carousel label="Cards" defaultIndex={0}>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    const panels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(panels.map((panel) => panel.getAttribute("aria-label"))).toEqual([
      "3 of 3",
      "1 of 3",
      "2 of 3",
      "3 of 3",
      "1 of 3",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(
      screen.getByRole("tab", { name: "3 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("moves forward through the trailing clone without reversing direction", () => {
    render(
      <Carousel label="Cards" defaultIndex={2}>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(
      screen.getByRole("tab", { name: "1 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("uses the active indicator as a countdown and advances on schedule", () => {
    vi.useFakeTimers();

    render(
      <Carousel label="Cards" defaultIndex={1} interval={1_000} autoplay>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    expect(
      screen.getByRole("tab", { name: "2 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");

    act(() => vi.advanceTimersByTime(1_000));

    expect(
      screen.getByRole("tab", { name: "3 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("pauses and resumes automatic rotation", () => {
    vi.useFakeTimers();

    render(
      <Carousel label="Cards" defaultIndex={0} interval={1_000} autoplay>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Pause slide rotation" }),
    );
    act(() => vi.advanceTimersByTime(2_000));
    expect(
      screen.getByRole("tab", { name: "1 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");

    fireEvent.click(
      screen.getByRole("button", { name: "Start slide rotation" }),
    );
    act(() => vi.advanceTimersByTime(1_000));
    expect(
      screen.getByRole("tab", { name: "2 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("pauses automatic rotation while a mouse pointer is over the slides", () => {
    vi.useFakeTimers();

    render(
      <Carousel label="Cards" defaultIndex={0} interval={1_000} autoplay>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    const slides = screen.getByRole("group", { name: "Slides" });
    fireEvent.pointerEnter(slides, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(1_500));
    expect(
      screen.getByRole("tab", { name: "1 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");

    fireEvent.pointerLeave(slides, { pointerType: "mouse" });
    act(() => vi.advanceTimersByTime(1_000));
    expect(
      screen.getByRole("tab", { name: "2 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });
});
