import type { CellContext } from "@tanstack/react-table";
import type { StackedDecksRow } from "../../../../hooks";

export function ComparedToResearchCell({
  getValue,
}: CellContext<StackedDecksRow, number | null>) {
  const value = getValue();

  if (value === null) {
    return <span className="tabular-nums">—</span>;
  }

  if (value >= 0.9 && value <= 1.1) {
    return <span className="tabular-nums">About expected</span>;
  }

  return <span className="tabular-nums">{value.toFixed(2)}x as often</span>;
}
