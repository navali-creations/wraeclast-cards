const REFERENCE_TOLERANCE = 0.03;

type NumericInput = number | null | undefined;

export function formatPercent(value: NumericInput, approximate = false) {
  if (value == null) return "-";
  const valueText = `${(value * 100).toFixed(6)}%`;
  return approximate ? `~${valueText}` : valueText;
}

export function formatDeltaPercent(value: NumericInput) {
  if (value == null) return "-";

  const displayedPercent = (Math.abs(value) * 100).toFixed(6);
  if (Number(displayedPercent) === 0) return "0.000000%";

  return `${value > 0 ? "+" : "-"}${displayedPercent}%`;
}

export function formatComparedToReference(value: NumericInput) {
  if (value == null) return "-";

  const difference = value - 1;
  if (Math.abs(difference) <= REFERENCE_TOLERANCE + Number.EPSILON) {
    return "About expected";
  }

  return formatDeltaPercent(
    difference - Math.sign(difference) * REFERENCE_TOLERANCE,
  );
}

export function formatInteger(value: NumericInput) {
  if (value == null) return "-";
  return Math.floor(value).toLocaleString();
}
