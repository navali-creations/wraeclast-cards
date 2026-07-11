import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../../app/game-context";
import { resolveDefaultLeagueSlug } from "../../app/league-context";
import { gameToSlug } from "../../lib/gameSlug";

export const Route = createFileRoute("/soothsayer/")({
  validateSearch: (search: Record<string, unknown>) => ({
    gallery: typeof search.gallery === "string" ? search.gallery : undefined,
  }),
  beforeLoad: async ({ context: { queryClient }, search }) => {
    const game = resolveStoredGame();
    const league = await resolveDefaultLeagueSlug(queryClient, game);

    throw redirect({
      to: "/$game/$league/soothsayer",
      params: { game: gameToSlug(game), league },
      search,
    });
  },
});
