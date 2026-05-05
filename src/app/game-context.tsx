import { createContext, useContext, useState } from "react";
import { EGame } from "../enums";

interface GameContextValue {
  game: EGame;
  setGame?: (game: EGame) => void;
}

function applyGame(selectedGame: EGame): EGame {
  document.documentElement.setAttribute("data-theme", selectedGame);
  localStorage.setItem("game", selectedGame);
  return selectedGame;
}

const GameContext = createContext<GameContextValue>({
  game: EGame.Poe1,
  setGame: () => undefined,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<EGame>(() => {
    const stored = localStorage.getItem("game");
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

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}

export { GameContext };
