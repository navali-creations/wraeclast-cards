import type { CellContext } from "@tanstack/react-table";
import type { StackedDecksRow } from "../../../../hooks";

function getDropRateClassName(rate: number): string {
  if (rate >= 0.06)
    return "bg-(--color-success) text-(--color-success-content)";
  if (rate >= 0.03)
    return "bg-(--color-warning) text-(--color-warning-content)";
  if (rate >= 0.01) return "bg-(--wc-gold-dim) text-(--wc-text-30)";
  return "bg-(--wc-bg-dimmed) text-(--wc-text-50)";
}

export function DropRateBadgeCell({
  getValue,
}: CellContext<StackedDecksRow, number>) {
  const rate = getValue();
  const className = getDropRateClassName(rate);
  const label = `${(rate * 1000).toFixed(2).replace(/\.?0+$/, "")}%`;
  return (
    <span
      className={`inline-block min-w-12 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${className}`}
    >
      {label}
    </span>
  );
}
