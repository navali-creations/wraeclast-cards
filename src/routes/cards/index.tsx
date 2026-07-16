import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../../app/game-context";
import { resolveDefaultLeagueSlug } from "../../app/league-context";
import { validateCardsSearch } from "../../features/cards/cardsSearchParams";
import { gameToSlug } from "../../lib/gameSlug";

export const Route = createFileRoute("/cards/")({
  validateSearch: validateCardsSearch,
  beforeLoad: async ({ context: { queryClient }, search }) => {
    const game = resolveStoredGame();
    const league = await resolveDefaultLeagueSlug(queryClient, game);

    throw redirect({
      to: "/$game/$league/cards",
      params: { game: gameToSlug(game), league },
      search,
    });
  },
});
