import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../app/game-context";
import { resolveDefaultLeagueSlug } from "../app/league-context";
import { gameToSlug } from "../lib/gameSlug";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const game = resolveStoredGame();
    const league = await resolveDefaultLeagueSlug(queryClient, game);

    throw redirect({
      to: "/$game/$league",
      params: { game: gameToSlug(game), league },
    });
  },
});
