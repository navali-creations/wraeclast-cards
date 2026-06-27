import type { DropRate, SoothsayerStat } from "../types";

// Placeholder values — will be updated once real stats are available in the data file.
export const soothsayerStats: SoothsayerStat[] = [
  { value: "659", label: "Decks" },
  { value: "28", label: "Cards" },
  { value: "3.45d", label: "Value", highlight: "positive" },
  { value: "-5.03d", label: "Profit", highlight: "negative" },
];

export const topDropRates: DropRate[] = [
  { cardName: "Rain of Chaos", rate: "8.42%" },
  { cardName: "The Gambler", rate: "7.01%" },
  { cardName: "Emperor's Luck", rate: "6.79%" },
  { cardName: "Three Faces in the Dark", rate: "6.76%" },
  { cardName: "Monochrome", rate: "6%" },
];
