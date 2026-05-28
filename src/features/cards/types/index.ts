export type Card = {
  id: string;
  name: string;
  imageUrl?: string;
  flavourText?: string;
  rewardText: string;
  stackSize: number;
  dropLocations: string[];
};
