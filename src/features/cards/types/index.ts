/*
0 = unknown, no data
1 = extremely rare
2 = rare
3 = less common
4 = common
*/
export type CardRarity = 0 | 1 | 2 | 3 | 4;

export type Card = {
  id: string;
  name: string;
  imageUrl?: string;
  frameUrl: string;
  separatorUrl: string;
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
