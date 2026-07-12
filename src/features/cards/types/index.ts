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
};
