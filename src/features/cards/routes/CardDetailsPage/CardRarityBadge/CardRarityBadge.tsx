import {
  DIVINATION_CARD_RARITY_LABELS,
  type DivinationCardRarity,
} from "../../../../../lib/divinationCards";
import { CARD_RARITY_BADGE_STYLES } from "./CardRarityBadge.utils";

export function CardRarityBadge({ rarity }: { rarity: DivinationCardRarity }) {
  return (
    <span
      className="badge badge-sm whitespace-nowrap"
      style={CARD_RARITY_BADGE_STYLES[rarity]}
    >
      {DIVINATION_CARD_RARITY_LABELS[rarity]}
    </span>
  );
}
