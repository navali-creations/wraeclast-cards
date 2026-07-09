import { Link } from "@tanstack/react-router";
import { useGameContext } from "../../../../app/game-context";
import { DivinationCard } from "../../../../components/DivinationCard";
import { gameToSlug } from "../../../../lib/gameSlug";
import type { Card } from "../../../cards/types";

const CARD_W = 320;
const CARD_H = 476;
export const SCALE = 0.55;

export function ScaledCard({ card }: { card: Card }) {
  const { game } = useGameContext();

  return (
    <Link
      to="/$game/cards/$cardId"
      params={{ game: gameToSlug(game), cardId: card.id }}
      className="block"
      style={{
        width: CARD_W * SCALE,
        height: CARD_H * SCALE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          width: CARD_W,
          height: CARD_H,
        }}
      >
        <DivinationCard card={card} />
      </div>
    </Link>
  );
}
