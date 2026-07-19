import type { DivinationCardRarity } from "../../../lib/divinationCards";

export type Card = {
  id: string;
  name: string;
  imageUrl?: string;
  frameUrl: string;
  separatorUrl: string;
  flavourText?: string;
  rewardText: string;
  rewardHtml: string;
  rewardSearchText: string;
  rewardTags: string[];
  stackSize: number;
  dropLocations: string[];
  rarity: DivinationCardRarity;
  weight?: number;
  fromBoss: boolean;
  isDisabled: boolean;
};
