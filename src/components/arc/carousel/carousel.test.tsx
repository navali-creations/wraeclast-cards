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
import {
  carouselIndicatorEmphasis,
  createCarouselLoopGeometry,
} from "./carousel.utils";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Carousel", () => {
  it("uses the buffered real-slide position for indicator emphasis", () => {
    const geometry = createCarouselLoopGeometry(4);
    const activePosition = geometry.firstRealPosition + 1;

    expect(carouselIndicatorEmphasis(activePosition, 1, geometry)).toBe(1);
    expect(carouselIndicatorEmphasis(activePosition, 2, geometry)).toBe(0);
  });

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
      "2 of 3",
      "3 of 3",
      "1 of 3",
      "2 of 3",
      "3 of 3",
      "1 of 3",
      "2 of 3",
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(
      screen.getByRole("tab", { name: "3 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      screen
        .getAllByRole("tabpanel", { hidden: true })
        .find(
          (panel) =>
            panel.getAttribute("aria-label") === "3 of 3" &&
            panel.getAttribute("aria-hidden") === null,
        )
        ?.hasAttribute("inert"),
    ).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(
      screen.getByRole("tab", { name: "2 of 3" }).getAttribute("aria-selected"),
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
    expect(
      screen
        .getAllByRole("tabpanel", { hidden: true })
        .find(
          (panel) =>
            panel.getAttribute("aria-label") === "1 of 3" &&
            panel.getAttribute("aria-hidden") === null,
        )
        ?.hasAttribute("inert"),
    ).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(
      screen.getByRole("tab", { name: "2 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("reconciles the active position when a single slide grows into a loop", () => {
    const { rerender } = render(
      <Carousel label="Cards" defaultIndex={0}>
        <div>One</div>
      </Carousel>,
    );

    rerender(
      <Carousel label="Cards" defaultIndex={0}>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    const firstRealSlide = screen
      .getAllByRole("tabpanel", { hidden: true })
      .find(
        (panel) =>
          panel.getAttribute("aria-label") === "1 of 3" &&
          panel.getAttribute("aria-hidden") === null,
      );

    expect(firstRealSlide?.hasAttribute("inert")).toBe(false);
    expect(
      screen
        .getByRole("region", { name: "Cards" })
        .style.getPropertyValue("--carousel-start"),
    ).toBe("2");
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(
      screen.getByRole("tab", { name: "3 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("restores a controlled index when more slides become available", () => {
    const { rerender } = render(
      <Carousel label="Cards" index={1}>
        <div>One</div>
      </Carousel>,
    );

    rerender(
      <Carousel label="Cards" index={1}>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    const secondRealSlide = screen
      .getAllByRole("tabpanel", { hidden: true })
      .find(
        (panel) =>
          panel.getAttribute("aria-label") === "2 of 3" &&
          panel.getAttribute("aria-hidden") === null,
      );

    expect(secondRealSlide?.hasAttribute("inert")).toBe(false);
    expect(
      screen
        .getByRole("region", { name: "Cards" })
        .style.getPropertyValue("--carousel-start"),
    ).toBe("3");
    expect(
      screen.getByRole("tab", { name: "2 of 3" }).getAttribute("aria-selected"),
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

  it("advances autoplay continuously across the last-to-first boundary", () => {
    vi.useFakeTimers();

    render(
      <Carousel label="Cards" defaultIndex={2} interval={1_000} autoplay>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
      </Carousel>,
    );

    act(() => vi.advanceTimersByTime(1_000));

    expect(
      screen.getByRole("tab", { name: "1 of 3" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(
      screen
        .getAllByRole("tabpanel", { hidden: true })
        .find(
          (panel) =>
            panel.getAttribute("aria-label") === "1 of 3" &&
            panel.getAttribute("aria-hidden") === null,
        )
        ?.hasAttribute("inert"),
    ).toBe(false);
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
