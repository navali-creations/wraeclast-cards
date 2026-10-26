// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { MouseEventHandler, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ComparisonHeaderActions } from "./ComparisonHeaderActions";

const comparisonContextMock = vi.hoisted(() => vi.fn());

vi.mock(
  "../StackedDecksComparisonContext/StackedDecksComparisonContext",
  () => ({ useStackedDecksComparison: comparisonContextMock }),
);

interface MockButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-pressed"?: boolean;
}

vi.mock("../../../../../components/buttons", () => ({
  Button: ({
    children,
    onClick,
    "aria-pressed": ariaPressed,
  }: MockButtonProps) => (
    <button type="button" onClick={onClick} aria-pressed={ariaPressed}>
      {children}
    </button>
  ),
  ButtonInternalLink: ({ children }: { children: ReactNode }) => (
    <a href="/stacked-decks">{children}</a>
  ),
}));

afterEach(() => {
  cleanup();
  comparisonContextMock.mockReset();
  vi.useRealTimers();
});

describe("ComparisonHeaderActions", () => {
  it("puts comparison search and verification controls in the page header", () => {
    vi.useFakeTimers();
    const setSearchTerm = vi.fn();
    const setVerified = vi.fn();

    comparisonContextMock.mockReturnValue({
      view: "movers",
      searchTerm: "",
      setSearchTerm,
      rows: [{ name: "The Doctor" }],
      verified: false,
      setVerified,
    });

    const { container } = render(<ComparisonHeaderActions />);

    expect(container.firstElementChild?.className).toContain(
      "grid w-full min-w-0",
    );
    expect(
      screen.getByPlaceholderText("Filter cards…").parentElement?.className,
    ).toContain("sm:w-56 sm:max-w-56");

    fireEvent.change(screen.getByPlaceholderText("Filter cards…"), {
      target: { value: "doctor" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Verified" }));

    expect(setSearchTerm).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(300));
    expect(setSearchTerm).toHaveBeenCalledWith("doctor");
    expect(setVerified).toHaveBeenCalledWith(true);
    expect(screen.getByRole("link", { name: "Drop-rate table" })).toBeTruthy();
  });
});
