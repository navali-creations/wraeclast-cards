import type { CardRarity } from "../../../types";
import { CardRarityBadge } from "../CardRarityBadge";

interface CardDetailsPageSubtitleProps {
  rarity: CardRarity;
  leagueName: string;
}

export function CardDetailsPageSubtitle({
  rarity,
  leagueName,
}: CardDetailsPageSubtitleProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <CardRarityBadge rarity={rarity} />
      {leagueName} league
    </span>
  );
}
