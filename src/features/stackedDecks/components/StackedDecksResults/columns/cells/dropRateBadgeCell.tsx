import type { CellContext } from "@tanstack/react-table";
import type { StackedDecksRow } from "../../../../hooks";

export function dropRateBadgeCell({
  getValue,
}: CellContext<StackedDecksRow, number>) {
  const rate = getValue();
  const className =
    rate >= 0.06
      ? "bg-(--color-success) text-(--color-success-content)"
      : rate >= 0.03
        ? "bg-(--color-warning) text-(--color-warning-content)"
        : rate >= 0.01
          ? "bg-(--wc-gold-dim) text-(--wc-text-30)"
          : "bg-(--wc-bg-dimmed) text-(--wc-text-50)";
  const label = `${(rate * 100).toFixed(2).replace(/\.?0+$/, "")}%`;
  return (
    <span
      className={`inline-block min-w-12 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${className}`}
    >
      {label}
    </span>
  );
}
