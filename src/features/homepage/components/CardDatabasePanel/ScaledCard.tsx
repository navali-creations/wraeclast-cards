import { DivinationCard } from "../../../../components/DivinationCard";
import { CardLink } from "../../../../components/DivinationCard/CardLink/CardLink";
import type { Card } from "../../../cards/types";

export const CARD_DATABASE_CARD_SCALE_CLASS_NAME =
  "[--wc-card-scale:0.35] xs:[--wc-card-scale:0.55]";

export const CARD_DATABASE_SKELETON_CARD_CLASS_NAME = `wc-card-shimmer h-[calc(29.75rem*var(--wc-card-scale))] w-[calc(20rem*var(--wc-card-scale))] rounded border border-(--wc-border) ${CARD_DATABASE_CARD_SCALE_CLASS_NAME}`;

export function ScaledCard({ card }: { card: Card }) {
  return (
    <CardLink cardId={card.id} className="block">
      <DivinationCard
        card={card}
        scaleClassName={CARD_DATABASE_CARD_SCALE_CLASS_NAME}
      />
    </CardLink>
  );
}
