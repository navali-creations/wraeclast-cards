import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../app/game-context";
import { gameToSlug } from "../lib/gameSlug";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/$game",
      params: { game: gameToSlug(resolveStoredGame()) },
    });
  },
});
