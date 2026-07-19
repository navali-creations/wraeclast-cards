import type { DivinationCardRarity } from "../../../lib/divinationCards";
import { CommonEffect } from "./CommonEffect";
import { ExtremelyRareEffect } from "./ExtremelyRareEffect";
import { RareEffect } from "./RareEffect";
import type { CardEffectProps } from "./types";

interface RarityEffectsProps extends CardEffectProps {
  rarity: DivinationCardRarity;
}

export function RarityEffects({ rarity, ...effectProps }: RarityEffectsProps) {
  if (rarity === 1) return <ExtremelyRareEffect {...effectProps} />;
  if (rarity === 2) return <RareEffect {...effectProps} />;
  return <CommonEffect {...effectProps} />;
}
