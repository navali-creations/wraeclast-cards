import type { CellContext } from "@tanstack/react-table";
import type { StackedDecksRow } from "../../../../hooks";

export function ComparedToResearchCell({
  getValue,
}: CellContext<StackedDecksRow, number | null>) {
  const value = getValue();
  const label =
    value === null
      ? "—"
      : value >= 0.9 && value <= 1.1
        ? "About expected"
        : `${value.toFixed(2)}x as often`;
  return <span className="tabular-nums">{label}</span>;
}
