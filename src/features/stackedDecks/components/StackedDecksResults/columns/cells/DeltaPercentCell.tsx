import { clsx } from "clsx";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const GREEN_HEATMAP_CLASSES = [
  "bg-green-50 text-green-950 ring-green-200",
  "bg-green-100 text-green-950 ring-green-200",
  "bg-green-200 text-green-950 ring-green-300",
  "bg-green-300 text-green-950 ring-green-400",
  "bg-green-400 text-green-950 ring-green-500",
  "bg-green-500 text-white ring-green-600",
  "bg-green-600 text-white ring-green-700",
  "bg-green-700 text-white ring-green-800",
  "bg-green-800 text-white ring-green-900",
  "bg-green-900 text-white ring-green-950",
  "bg-green-950 text-white ring-green-950",
] as const;

const RED_HEATMAP_CLASSES = [
  "bg-red-50 text-red-950 ring-red-200",
  "bg-red-100 text-red-950 ring-red-200",
  "bg-red-200 text-red-950 ring-red-300",
  "bg-red-300 text-red-950 ring-red-400",
  "bg-red-400 text-red-950 ring-red-500",
  "bg-red-500 text-white ring-red-600",
  "bg-red-600 text-white ring-red-700",
  "bg-red-700 text-white ring-red-800",
  "bg-red-800 text-white ring-red-900",
  "bg-red-900 text-white ring-red-950",
  "bg-red-950 text-white ring-red-950",
] as const;

const DELTA_HEATMAP_THRESHOLDS = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20];

function deltaHeatmapClassName(value: number) {
  if (value === 0) return undefined;

  const absValue = Math.abs(value);
  const index = DELTA_HEATMAP_THRESHOLDS.findIndex(
    (threshold) => absValue < threshold,
  );
  const bucket =
    index === -1 ? DELTA_HEATMAP_THRESHOLDS.length : Math.max(index, 0);

  return value > 0
    ? GREEN_HEATMAP_CLASSES[bucket]
    : RED_HEATMAP_CLASSES[bucket];
}

interface DeltaPercentCellProps {
  value: number | null | undefined;
  neutralLabel?: string;
}

export function DeltaPercentCell({
  value,
  neutralLabel,
}: DeltaPercentCellProps) {
  if (value == null) {
    return <span className="tabular-nums">—</span>;
  }

  const displayedPercent = (Math.abs(value) * 100).toFixed(2);

  if (displayedPercent === "0.00") {
    return (
      <span className="inline-flex min-w-20 justify-center rounded-sm px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 bg-(--wc-bg-dimmed) text-(--wc-text-50) ring-(--wc-border-dimmed)">
        {neutralLabel ?? "0.00%"}
      </span>
    );
  }

  const Icon = value > 0 ? FiArrowUp : FiArrowDown;
  const directionLabel = value > 0 ? "Up" : "Down";

  return (
    <span
      className={clsx(
        "inline-flex min-w-20 items-center justify-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold tabular-nums ring-1",
        deltaHeatmapClassName(value),
      )}
    >
      <span className="sr-only">{directionLabel} </span>
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {displayedPercent}%
    </span>
  );
}
