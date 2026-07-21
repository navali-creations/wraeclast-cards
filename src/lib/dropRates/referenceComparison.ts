const REFERENCE_TOLERANCE = 0.03;
const DISPLAYED_DELTA_FRACTION_DIGITS = 2;
const MIN_DISPLAYED_DELTA = 0.5 / 10 ** (DISPLAYED_DELTA_FRACTION_DIGITS + 2);

type NumericInput = number | null | undefined;

export function comparedToReferenceDelta(value: NumericInput) {
  if (value == null) return null;

  const difference = value - 1;
  if (Math.abs(difference) <= REFERENCE_TOLERANCE + Number.EPSILON) {
    return 0;
  }

  const differenceBeyondTolerance =
    difference - Math.sign(difference) * REFERENCE_TOLERANCE;

  return Math.abs(differenceBeyondTolerance) < MIN_DISPLAYED_DELTA
    ? 0
    : differenceBeyondTolerance;
}
