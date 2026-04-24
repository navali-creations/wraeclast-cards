import { createContext, useContext, useEffect, useState } from "react";

type Game = "poe1" | "poe2";

interface GameContextValue {
  game: Game;
  setGame: (game: Game) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game>(
    () => (localStorage.getItem("game") as Game) ?? "poe1",
  );

  useEffect(() => {
    localStorage.setItem("game", game);
  }, [game]);

  return (
    <GameContext.Provider value={{ game, setGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
