import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../../app/game-context";
import { resolveDefaultLeagueSlug } from "../../app/league-context";
import { gameToSlug } from "../../lib/gameSlug";

export const Route = createFileRoute("/cards/$cardId")({
  beforeLoad: async ({ context: { queryClient }, params }) => {
    const game = resolveStoredGame();
    const league = await resolveDefaultLeagueSlug(queryClient, game);

    throw redirect({
      to: "/$game/$league/cards/$cardId",
      params: {
        game: gameToSlug(game),
        league,
        cardId: params.cardId,
      },
    });
  },
});
