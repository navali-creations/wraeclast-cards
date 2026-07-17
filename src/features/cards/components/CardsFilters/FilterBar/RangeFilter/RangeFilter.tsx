import { useEffect, useState } from "react";
import { NativeRangeSlider } from "../../../../../../components/NativeRangeSlider/NativeRangeSlider";
import {
  clampRangeValue,
  type FilterRange,
  type FilterRangeValue,
  getRangeLabel,
  getRangeMarkers,
  getRangePercent,
  normalizeRangeValue,
} from "../FilterBar.utils";

interface RangeFilterProps {
  facetId: string;
  label: string;
  range: FilterRange;
  value: FilterRangeValue;
  onCommit: (facetId: string, value: FilterRangeValue) => void;
}

export function RangeFilter({
  facetId,
  label,
  range,
  value,
  onCommit,
}: RangeFilterProps) {
  const clampedMin = clampRangeValue(range, value.min);
  const clampedMax = clampRangeValue(range, value.max);
  const safeMin = Math.min(clampedMin, clampedMax);
  const safeMax = Math.max(clampedMin, clampedMax);
  const [draftValue, setDraftValue] = useState<FilterRangeValue>({
    min: safeMin,
    max: safeMax,
  });

  useEffect(() => {
    setDraftValue({ min: safeMin, max: safeMax });
  }, [safeMin, safeMax]);

  const getSafeValue = (nextValue: FilterRangeValue) => {
    return normalizeRangeValue(range, nextValue);
  };

  const setDraftValueIfChanged = (nextValue: FilterRangeValue) => {
    setDraftValue((currentValue) =>
      currentValue.min === nextValue.min && currentValue.max === nextValue.max
        ? currentValue
        : nextValue,
    );
  };

  const handleValueChange = (nextValue: FilterRangeValue) => {
    setDraftValueIfChanged(getSafeValue(nextValue));
  };

  const handleValueCommitted = (value: FilterRangeValue) => {
    const nextValue = getSafeValue(value);
    setDraftValueIfChanged(nextValue);

    if (nextValue.min !== safeMin || nextValue.max !== safeMax) {
      onCommit(facetId, nextValue);
    }
  };

  const draftLabel = getRangeLabel(range, draftValue);
  const markers = getRangeMarkers(range);

  return (
    <div className="rounded border border-[#d2c097] bg-[#fbf4e6] px-3 py-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <NativeRangeSlider
            min={range.min}
            max={range.max}
            step={range.step ?? 1}
            value={draftValue}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommitted}
            minLabel={`${label} from`}
            maxLabel={`${label} to`}
            valueText={draftLabel}
          />
          <div className="relative mx-2 -mt-1 h-7 text-[11px] text-[#7a643f]">
            {markers.map((marker) => (
              <span
                key={marker}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1"
                style={{ left: `${getRangePercent(range, marker)}%` }}
              >
                <span className="h-2 border-l border-[#b6965a]" />
                <span>{marker}</span>
              </span>
            ))}
          </div>
        </div>

        <span className="mt-1 flex shrink-0 items-center gap-1 text-xs text-[#7a643f]">
          <span className="inline-flex w-7 justify-center rounded border border-[#d2c097] bg-[#eadbbe] px-1.5 py-0.5 tabular-nums text-[#6d5c3e]">
            {draftValue.min}
          </span>
          <span aria-hidden="true">-</span>
          <span className="inline-flex w-7 justify-center rounded border border-[#d2c097] bg-[#eadbbe] px-1.5 py-0.5 tabular-nums text-[#6d5c3e]">
            {draftValue.max}
          </span>
        </span>
      </div>
    </div>
  );
}
