import { DivinationCard } from "../../../../components/DivinationCard";
import { CardLink } from "../../../../components/DivinationCard/CardLink/CardLink";
import {
  DIVINATION_CARD_HEIGHT,
  DIVINATION_CARD_WIDTH,
} from "../../../../components/DivinationCard/constants";
import type { Card } from "../../../cards/types";

export const SCALE = 0.55;

export function ScaledCard({ card }: { card: Card }) {
  return (
    <CardLink
      cardId={card.id}
      className="block"
      style={{
        width: DIVINATION_CARD_WIDTH * SCALE,
        height: DIVINATION_CARD_HEIGHT * SCALE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          width: DIVINATION_CARD_WIDTH,
          height: DIVINATION_CARD_HEIGHT,
        }}
      >
        <DivinationCard card={card} />
      </div>
    </CardLink>
  );
}
