import type { Card } from "../../../types";

function formatInteger(value: number) {
  return value.toLocaleString("en-US");
}

export function getPlural(
  value: number,
  singular: string,
  plural = `${singular}s`,
) {
  return value === 1 ? singular : plural;
}

export function getWeightLabel(card: Card) {
  if (typeof card.weight !== "number") return "Not published";
  if (card.weight <= 0) return "No global weight";
  return formatInteger(card.weight);
}

export function getDropRateLabel(dropRate: number | null, isLoading: boolean) {
  if (isLoading) return "Loading...";
  if (dropRate == null) return "No data";
  return `${(dropRate * 100).toFixed(6)}%`;
}

export function getSourceLabel(card: Card) {
  if (card.fromBoss) return "Unique boss";
  if (card.isDisabled) return "Disabled";
  return "General pool";
}
