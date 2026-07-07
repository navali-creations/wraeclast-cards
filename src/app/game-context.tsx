import { createContext, useContext, useState } from "react";
import { EGame } from "../enums";

interface GameContextValue {
  game: EGame;
  setGame: (game: EGame) => void;
}

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

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<EGame>(() => {
    const stored = loadStoredGame();
    return applyGame(stored === EGame.Poe2 ? EGame.Poe2 : EGame.Poe1);
  });

  return (
    <GameContext.Provider
      value={{
        game,
        setGame: (selectedGame) => setGame(applyGame(selectedGame)),
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameContext must be used within a GameProvider");
  return context;
}

export { GameContext };
