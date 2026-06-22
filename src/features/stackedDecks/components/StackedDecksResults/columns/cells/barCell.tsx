import type { CellContext } from "@tanstack/react-table";
import type { StackedDecksRow } from "../../../../hooks";

export function barCell({
  getValue,
  table,
}: CellContext<StackedDecksRow, number>) {
  const maxWeight = table.options.meta?.maxWeight ?? 0;
  const value = getValue();
  const pct = maxWeight > 0 ? Math.round((value / maxWeight) * 100) : 0;
  return (
    <div className="flex flex-col items-end gap-1">
      <span>{value.toLocaleString()}</span>
      <div className="h-0.5 w-full overflow-hidden rounded-full bg-(--wc-border-dimmed)">
        <div
          className="h-full rounded-full bg-(--wc-hero-accent)"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
