import { Link } from "@tanstack/react-router";
import { useGameContext } from "../../app/game-context";
import { gameToSlug } from "../../lib/gameSlug";
import { Text } from "../text";

export function FooterBrand() {
  const { game } = useGameContext();

  return (
    <div className="sm:max-w-64">
      <Link
        to="/$game"
        params={{ game: gameToSlug(game) }}
        className="font-cinzel text-base font-bold tracking-widest uppercase text-(--wc-gold)"
      >
        Wraeclast<span className="text-(--color-primary)">.</span>Cards
      </Link>
      <Text size="sm" muted className="mt-2">
        Divination card database, price tracking, and stacked deck analytics for
        Path of Exile.
      </Text>
    </div>
  );
}
