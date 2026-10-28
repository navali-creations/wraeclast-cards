import { DivinationCard } from "../../../../components/DivinationCard";
import { CardLink } from "../../../../components/DivinationCard/CardLink/CardLink";
import type { Card } from "../../../cards/types";

const CARD_SCALE_CLASS_NAME =
  "[--wc-card-scale:0.38] xs:[--wc-card-scale:0.46] sm:[--wc-card-scale:0.52]";

export function FeaturedCardVisual({ card }: { card: Card }) {
  return (
    <CardLink
      cardId={card.id}
      aria-label={`View ${card.name}`}
      className="block shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--wc-gold)"
    >
      <DivinationCard card={card} scaleClassName={CARD_SCALE_CLASS_NAME} />
    </CardLink>
  );
}
