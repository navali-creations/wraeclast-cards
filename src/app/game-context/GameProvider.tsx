import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { createContext, useMemo, useState } from "react";
import { EGame } from "../../enums";
import { slugToGame } from "../../lib/gameSlug";
import { safeGetItem, safeSetItem } from "../../lib/safeLocalStorage";
import { useClientLayoutEffect } from "../../lib/useClientLayoutEffect/useClientLayoutEffect";

export interface GameContextValue {
  game: EGame;
  setGame: (game: EGame) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

function persistGame(selectedGame: EGame): EGame {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", selectedGame);
  }
  safeSetItem("game", selectedGame);
  return selectedGame;
}

function loadStoredGame(): string | null {
  return safeGetItem("game");
}

function resolveGameFromPathname(pathname: string): EGame | undefined {
  const [, firstSegment] = pathname.split("/");
  return firstSegment ? slugToGame(firstSegment) : undefined;
}

export function resolveStoredGame(
  pathname = typeof window === "undefined" ? "/" : window.location.pathname,
): EGame {
  const fromLocation = resolveGameFromPathname(pathname);
  if (fromLocation) return fromLocation;
  const stored = loadStoredGame();
  return stored === EGame.Poe2 ? EGame.Poe2 : EGame.Poe1;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const routeGame = resolveGameFromPathname(pathname);
  const [preferredGame, setPreferredGame] = useState<EGame>(EGame.Poe1);
  const game = routeGame ?? preferredGame;

  useClientLayoutEffect(() => {
    setPreferredGame(persistGame(resolveStoredGame(pathname)));
  }, [pathname]);

  const value = useMemo(
    () => ({
      game,
      setGame: (selectedGame: EGame) =>
        setPreferredGame(persistGame(selectedGame)),
    }),
    [game],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
