import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../../app/game-context";
import { gameToSlug } from "../../lib/gameSlug";

export const Route = createFileRoute("/cards/$cardId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$game/cards/$cardId",
      params: { game: gameToSlug(resolveStoredGame()), cardId: params.cardId },
    });
  },
});
