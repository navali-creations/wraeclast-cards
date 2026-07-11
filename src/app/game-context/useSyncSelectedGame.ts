import { useEffect } from "react";
import { slugToGame } from "../../lib/gameSlug";
import { useGameContext } from "./useGameContext";

// Keeps game context in sync with the :game URL param as the user
// navigates between game-scoped routes.
export function useSyncSelectedGame(slug: string) {
  const { game, setGame } = useGameContext();
  const targetGame = slugToGame(slug);

  useEffect(() => {
    if (targetGame && targetGame !== game) setGame(targetGame);
  }, [targetGame, game, setGame]);
}
