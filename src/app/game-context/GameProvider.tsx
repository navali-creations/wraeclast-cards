import type { ReactNode } from "react";
import { createContext, useMemo, useState } from "react";
import { EGame } from "../../enums";
import { slugToGame } from "../../lib/gameSlug";

export interface GameContextValue {
  game: EGame;
  setGame: (game: EGame) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

function applyGame(selectedGame: EGame): EGame {
  document.documentElement.setAttribute("data-theme", selectedGame);
  try {
    localStorage.setItem("game", selectedGame);
  } catch {
    // ignore storage errors (e.g. Safari private mode, blocked iframe)
  }
  return selectedGame;
}

function loadStoredGame(): string | null {
  try {
    return localStorage.getItem("game");
  } catch {
    return null;
  }
}

function resolveGameFromLocation(): EGame | undefined {
  const [, firstSegment] = window.location.pathname.split("/");
  return firstSegment ? slugToGame(firstSegment) : undefined;
}

export function resolveStoredGame(): EGame {
  const fromLocation = resolveGameFromLocation();
  if (fromLocation) return fromLocation;
  const stored = loadStoredGame();
  return stored === EGame.Poe2 ? EGame.Poe2 : EGame.Poe1;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<EGame>(() => applyGame(resolveStoredGame()));

  const value = useMemo(
    () => ({
      game,
      setGame: (selectedGame: EGame) => setGame(applyGame(selectedGame)),
    }),
    [game],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
