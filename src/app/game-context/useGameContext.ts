import { useContext } from "react";
import type { GameContextValue } from "./GameProvider";
import { GameContext } from "./GameProvider";

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameContext must be used within a GameProvider");
  return context;
}
