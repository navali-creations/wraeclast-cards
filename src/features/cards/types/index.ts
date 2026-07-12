export type CardRarity = 0 | 1 | 2 | 3 | 4;

export type Card = {
  id: string;
  name: string;
  imageUrl?: string;
  flavourText?: string;
  rewardText: string;
  rewardHtml: string;
  stackSize: number;
  dropLocations: string[];
  rarity: CardRarity;
  weight?: number;
  fromBoss: boolean;
  isDisabled: boolean;
};
