// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StackedDecksHeader } from "./StackedDecksHeader";

vi.mock("motion/react-m", () => ({
  div: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock("./StackedDecksHeaderActions/StackedDecksHeaderActions", () => ({
  StackedDecksHeaderActions: () => <div>Header actions</div>,
}));

afterEach(cleanup);

describe("StackedDecksHeader", () => {
  it("reserves the subtitle row while the next league summary loads", () => {
    const { container, rerender } = render(
      <StackedDecksHeader summary={undefined} />,
    );
    const loadingSubtitle = container.querySelector("p.mt-1.min-h-5");

    expect(loadingSubtitle).not.toBeNull();
    expect(loadingSubtitle?.getAttribute("aria-hidden")).toBe("true");

    rerender(
      <StackedDecksHeader
        summary={{ totalCount: 4_087_187, leagueName: "Mirage" }}
      />,
    );
    const loadedSubtitle = container.querySelector("p.mt-1.min-h-5");

    expect(loadedSubtitle).not.toBeNull();
    expect(loadedSubtitle?.getAttribute("aria-hidden")).toBeNull();
    expect(loadedSubtitle?.textContent).toContain(
      "4,087,187 observations · Mirage league",
    );
  });
});
