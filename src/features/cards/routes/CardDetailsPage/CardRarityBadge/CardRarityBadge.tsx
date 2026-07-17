import type { CardRarity } from "../../../types";
import {
  CARD_RARITY_BADGE_STYLES,
  CARD_RARITY_LABELS,
} from "./CardRarityBadge.utils";

export function CardRarityBadge({ rarity }: { rarity: CardRarity }) {
  return (
    <span
      className="badge badge-sm whitespace-nowrap"
      style={CARD_RARITY_BADGE_STYLES[rarity]}
    >
      {CARD_RARITY_LABELS[rarity]}
    </span>
  );
}
