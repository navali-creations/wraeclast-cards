import { Link } from "@tanstack/react-router";
import { DivinationCard } from "../../../../components/DivinationCard";
import type { Card } from "../../../cards/types";

const CARD_W = 320;
const CARD_H = 476;
export const SCALE = 0.55;

export function ScaledCard({ card }: { card: Card }) {
  return (
    <Link
      to="/cards/$cardId"
      params={{ cardId: card.id }}
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
