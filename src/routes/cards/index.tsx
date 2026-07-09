import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../../app/game-context";
import { gameToSlug } from "../../lib/gameSlug";
import { validateCardsSearch } from "../$game/cards";

export const Route = createFileRoute("/cards/")({
  validateSearch: validateCardsSearch,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/$game/cards",
      params: { game: gameToSlug(resolveStoredGame()) },
      search,
    });
  },
});
