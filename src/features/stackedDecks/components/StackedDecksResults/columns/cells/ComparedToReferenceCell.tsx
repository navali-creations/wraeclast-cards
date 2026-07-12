import type { CellContext } from "@tanstack/react-table";
import type { StackedDecksRow } from "../../../../hooks";
import { DeltaPercentCell } from "./DeltaPercentCell";

const REFERENCE_TOLERANCE = 0.03;

export function ComparedToReferenceCell({
  getValue,
}: CellContext<StackedDecksRow, number | null | undefined>) {
  const value = getValue();

  if (value == null) {
    return <span className="tabular-nums">—</span>;
  }

  const difference = value - 1;

  if (Math.abs(difference) <= REFERENCE_TOLERANCE + Number.EPSILON) {
    return <DeltaPercentCell value={0} neutralLabel="About expected" />;
  }

  const differenceBeyondTolerance =
    difference - Math.sign(difference) * REFERENCE_TOLERANCE;

  return <DeltaPercentCell value={differenceBeyondTolerance} />;
}
