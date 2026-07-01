export type SoothsayerStat = {
  value: string;
  label: string;
  highlight?: "positive" | "negative";
};

export type DropRate = {
  cardName: string;
  rate: string;
};

export type DropRatesLeague = {
  id: string;
  name: string;
  historical?: boolean;
};
