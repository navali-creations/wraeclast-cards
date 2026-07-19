import type { DivinationCardRarity } from "../../../../../lib/divinationCards";
import { CardRarityBadge } from "../CardRarityBadge/CardRarityBadge";

interface CardDetailsPageSubtitleProps {
  rarity: DivinationCardRarity;
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
