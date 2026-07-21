import { comparedToReferenceDelta } from "../../../../../lib/dropRates/referenceComparison";
import {
  formatPercentage,
  formatSignedPercentage,
} from "../../../../../lib/percentage";

type NumericInput = number | null | undefined;

export function formatPercent(value: NumericInput, approximate = false) {
  if (value == null) return "-";
  const valueText = formatPercentage(value);
  return approximate ? `~${valueText}` : valueText;
}

export function formatDeltaPercent(value: NumericInput) {
  if (value == null) return "-";
  return formatSignedPercentage(value);
}

export function formatComparedToReference(value: NumericInput) {
  const delta = comparedToReferenceDelta(value);
  if (delta == null) return "-";
  if (delta === 0) return "About expected";

  return formatDeltaPercent(delta);
}

export function formatInteger(value: NumericInput) {
  if (value == null) return "-";
  return Math.floor(value).toLocaleString();
}
