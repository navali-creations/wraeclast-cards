import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../app/game-context";
import { gameToSlug } from "../lib/gameSlug";
import { validateStackedDecksSearch } from "./$game/stacked-decks";

export const Route = createFileRoute("/stacked-decks")({
  validateSearch: validateStackedDecksSearch,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/$game/stacked-decks",
      params: { game: gameToSlug(resolveStoredGame()) },
      search,
    });
  },
});
