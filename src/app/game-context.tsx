import { type ChangeEvent, createContext, useState } from "react";
import { EGame } from "../enums";

interface GameContextValue {
  game: EGame;
  setGame?: (game: EGame) => void;
  handleGameToggle?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const GameContext = createContext<GameContextValue>({
  game: (localStorage.getItem("game") as EGame) ?? EGame.Poe1,
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const stored = localStorage.getItem("game");
  const [game, setGame] = useState<EGame>(
    stored === EGame.Poe2 ? EGame.Poe2 : EGame.Poe1,
  );

  const handleGameToggle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as EGame;
    setGame(value);
    localStorage.setItem("game", value);
  };

  return (
    <GameContext.Provider value={{ game, setGame, handleGameToggle }}>
      {children}
    </GameContext.Provider>
  );
}

export { GameContext };
