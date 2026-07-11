import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../app/game-context";
import { resolveDefaultLeagueSlug } from "../app/league-context";
import { gameToSlug } from "../lib/gameSlug";
import { validateStackedDecksSearch } from "./$game/$league/stacked-decks";

export const Route = createFileRoute("/stacked-decks")({
  validateSearch: validateStackedDecksSearch,
  beforeLoad: async ({ context: { queryClient }, search }) => {
    const game = resolveStoredGame();
    const league = await resolveDefaultLeagueSlug(queryClient, game);

    throw redirect({
      to: "/$game/$league/stacked-decks",
      params: { game: gameToSlug(game), league },
      search,
    });
  },
});
