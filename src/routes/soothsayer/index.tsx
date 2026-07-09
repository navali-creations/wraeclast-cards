import { createFileRoute, redirect } from "@tanstack/react-router";
import { resolveStoredGame } from "../../app/game-context";
import { gameToSlug } from "../../lib/gameSlug";

export const Route = createFileRoute("/soothsayer/")({
  validateSearch: (search: Record<string, unknown>) => ({
    gallery: typeof search.gallery === "string" ? search.gallery : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/$game/soothsayer",
      params: { game: gameToSlug(resolveStoredGame()) },
      search,
    });
  },
});
