import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { useGameContext } from "../../app/game-context";
import { gameToSlug } from "../../lib/gameSlug";

export function HeaderBrand() {
  const { game } = useGameContext();

  return (
    <Link
      to="/$game"
      params={{ game: gameToSlug(game) }}
      className={clsx(
        "font-cinzel text-lg font-bold tracking-widest uppercase text-(--wc-gold) px-2",
      )}
    >
      Wraeclast<span className="text-(--color-primary)">.</span>Cards
    </Link>
  );
}
