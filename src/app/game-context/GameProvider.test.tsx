// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EGame } from "../../enums";
import { GameProvider } from "./GameProvider";
import { useGameContext } from "./useGameContext";

const routerState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useRouterState: () => routerState.pathname,
  };
});

function GameValue() {
  const { game } = useGameContext();
  return <span>{game}</span>;
}

describe("GameProvider hydration preferences", () => {
  beforeEach(() => {
    localStorage.clear();
    routerState.pathname = "/";
  });

  it("applies a stored game before the browser paints", () => {
    localStorage.setItem("game", EGame.Poe2);

    render(
      <GameProvider>
        <GameValue />
      </GameProvider>,
    );

    expect(screen.getByText(EGame.Poe2)).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe(EGame.Poe2);
  });

  it("lets an explicit route override the stored game", () => {
    localStorage.setItem("game", EGame.Poe2);
    routerState.pathname = "/path-of-exile/keepers";

    render(
      <GameProvider>
        <GameValue />
      </GameProvider>,
    );

    expect(screen.getByText(EGame.Poe1)).toBeTruthy();
    expect(localStorage.getItem("game")).toBe(EGame.Poe1);
  });
});
