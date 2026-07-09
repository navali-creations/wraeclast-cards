import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGameContext } from "../app/game-context";
import { slugToGame } from "../lib/gameSlug";

export const Route = createFileRoute("/$game")({
  params: {
    parse: (params) => {
      if (!slugToGame(params.game)) throw notFound();
      return { game: params.game };
    },
  },
  component: GameLayout,
});

function GameLayout() {
  const { game: slug } = Route.useParams();
  const { game, setGame } = useGameContext();
  const targetGame = slugToGame(slug);

  useEffect(() => {
    if (targetGame && targetGame !== game) setGame(targetGame);
  }, [targetGame, game, setGame]);

  return <Outlet />;
}
