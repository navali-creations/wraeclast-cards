import { CommonEffect } from "./CommonEffect";
import { ExtremelyRareEffect } from "./ExtremelyRareEffect";
import { RareEffect } from "./RareEffect";
import type { CardEffectProps } from "./types";

interface RarityEffectsProps extends CardEffectProps {
  stackSize: number;
}

export function RarityEffects({
  stackSize,
  ...effectProps
}: RarityEffectsProps) {
  if (stackSize === 1) return <ExtremelyRareEffect {...effectProps} />;
  if (stackSize <= 4) return <RareEffect {...effectProps} />;
  return <CommonEffect {...effectProps} />;
}
