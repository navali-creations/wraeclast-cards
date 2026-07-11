import type { ReactNode } from "react";
import { createContext, useMemo, useState } from "react";
import { EGame } from "../../enums";
import { slugToGame } from "../../lib/gameSlug";
import { safeGetItem, safeSetItem } from "../../lib/safeLocalStorage";

export interface GameContextValue {
  game: EGame;
  setGame: (game: EGame) => void;
}

export const GameContext = createContext<GameContextValue | null>(null);

function applyGame(selectedGame: EGame): EGame {
  document.documentElement.setAttribute("data-theme", selectedGame);
  safeSetItem("game", selectedGame);
  return selectedGame;
}

function loadStoredGame(): string | null {
  return safeGetItem("game");
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
