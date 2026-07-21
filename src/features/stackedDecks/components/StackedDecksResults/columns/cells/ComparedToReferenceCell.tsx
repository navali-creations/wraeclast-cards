import type { CellContext } from "@tanstack/react-table";
import { comparedToReferenceDelta } from "../../../../../../lib/dropRates/referenceComparison";
import type { StackedDecksRow } from "../../../../hooks";
import { DeltaPercentCell } from "./DeltaPercentCell";

export function ComparedToReferenceCell({
  getValue,
}: CellContext<StackedDecksRow, number | null | undefined>) {
  const delta = comparedToReferenceDelta(getValue());

  if (delta == null) {
    return <span className="tabular-nums">—</span>;
  }

  if (delta === 0) {
    return <DeltaPercentCell value={0} neutralLabel="About expected" />;
  }

  return <DeltaPercentCell value={delta} />;
}
