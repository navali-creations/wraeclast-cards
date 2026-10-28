// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

afterEach(cleanup);

describe("Tooltip", () => {
  it("uses a manual popover anchored to its trigger", () => {
    render(<Tooltip content="Helpful text">Trigger</Tooltip>);

    const trigger = screen.getByText("Trigger");
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    const caret = tooltip.querySelector("[aria-hidden='true']");

    expect(trigger.getAttribute("data-tip")).toBe("Helpful text");
    expect(trigger.getAttribute("aria-describedby")).toBe(tooltip.id);
    expect(trigger.style.anchorName).toBeTruthy();
    expect(tooltip.style.positionAnchor).toBe(trigger.style.anchorName);
    expect(tooltip.getAttribute("popover")).toBe("manual");
    expect(tooltip.getAttribute("data-placement")).toBe("bottom");
    expect(caret).toBeTruthy();
  });

  it("opens on hover and closes when the trigger is left", () => {
    render(<Tooltip content="Helpful text">Trigger</Tooltip>);

    const trigger = screen.getByText("Trigger");
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    tooltip.showPopover = showPopover;
    tooltip.hidePopover = hidePopover;

    fireEvent.mouseEnter(trigger);
    expect(showPopover).toHaveBeenCalledOnce();

    fireEvent.mouseLeave(trigger);
    expect(hidePopover).toHaveBeenCalledOnce();
  });

  it("stays open while either hovered or focused", () => {
    render(
      <Tooltip content="Helpful text">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const button = screen.getByRole("button", { name: "Trigger" });
    const wrapper = button.parentElement;
    if (!wrapper) throw new Error("Expected the tooltip wrapper to exist");
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    const showPopover = vi.fn();
    const hidePopover = vi.fn();
    tooltip.showPopover = showPopover;
    tooltip.hidePopover = hidePopover;

    fireEvent.mouseEnter(wrapper);
    fireEvent.focus(button);
    fireEvent.mouseLeave(wrapper);
    expect(hidePopover).not.toHaveBeenCalled();

    fireEvent.blur(button);
    expect(hidePopover).toHaveBeenCalledOnce();
  });

  it("does not expose or open a disabled tooltip", () => {
    render(
      <Tooltip content="Unavailable" disableTooltip>
        Trigger
      </Tooltip>,
    );

    const trigger = screen.getByText("Trigger");
    const tooltip = screen.getByRole("tooltip", { hidden: true });
    const showPopover = vi.fn();
    tooltip.showPopover = showPopover;

    fireEvent.mouseEnter(trigger);

    expect(trigger.hasAttribute("aria-describedby")).toBe(false);
    expect(trigger.hasAttribute("data-tip")).toBe(false);
    expect(showPopover).not.toHaveBeenCalled();
  });

  it("can describe a supplied child instead of the wrapper", () => {
    render(
      <Tooltip content="Helpful text" describeChild data-testid="trigger">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const wrapper = screen.getByTestId("trigger");
    const button = screen.getByRole("button", { name: "Trigger" });
    const tooltip = screen.getByRole("tooltip", { hidden: true });

    expect(wrapper.hasAttribute("aria-describedby")).toBe(false);
    expect(button.getAttribute("aria-describedby")).toBe(tooltip.id);
  });
});
