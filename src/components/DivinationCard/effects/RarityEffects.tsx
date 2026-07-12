import type { CardRarity } from "../../../features/cards/types";
import { CommonEffect } from "./CommonEffect";
import { ExtremelyRareEffect } from "./ExtremelyRareEffect";
import { RareEffect } from "./RareEffect";
import type { CardEffectProps } from "./types";

interface RarityEffectsProps extends CardEffectProps {
  rarity: CardRarity;
}

export function RarityEffects({ rarity, ...effectProps }: RarityEffectsProps) {
  if (rarity === 1) return <ExtremelyRareEffect {...effectProps} />;
  if (rarity === 2 || rarity === 3) return <RareEffect {...effectProps} />;
  return <CommonEffect {...effectProps} />;
}
