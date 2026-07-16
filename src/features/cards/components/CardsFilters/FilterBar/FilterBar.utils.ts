import type { CSSProperties, ReactNode } from "react";

export type FilterRangeValue = {
  min: number;
  max: number;
};

export type FilterOption = {
  label: string;
  value: string;
  count?: number;
  color?: string;
};

export type FilterRange = {
  min: number;
  max: number;
  step?: number;
  valueLabel?: (value: FilterRangeValue) => string;
};

export type FilterFacet = {
  id: string;
  label: string;
  icon?: ReactNode;
  type?: "options" | "range";
  options: FilterOption[];
  range?: FilterRange;
  maxVisibleOptions?: number;
};

export type FilterValue = Record<string, string[]>;

export function normalizeValue(value: FilterValue): FilterValue {
  return Object.fromEntries(
    Object.entries(value).filter(([, selected]) => selected.length > 0),
  );
}

export function getSelectedOptions(
  facet: FilterFacet,
  selectedValues: string[],
) {
  const optionsByValue = new Map(
    facet.options.map((option) => [option.value, option]),
  );

  return selectedValues.map(
    (value) =>
      optionsByValue.get(value) ?? {
        value,
        label: value
          .split("-")
          .filter(Boolean)
          .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
          .join(" "),
      },
  );
}

export function getDisplayOptions(
  facet: FilterFacet,
  selectedValues: string[],
  query: string,
) {
  const optionsByValue = new Map(
    facet.options.map((option) => [option.value, option]),
  );

  for (const option of getSelectedOptions(facet, selectedValues)) {
    optionsByValue.set(option.value, option);
  }

  const options = [...optionsByValue.values()];
  if (!query) return options;

  return options.filter((option) => option.label.toLowerCase().includes(query));
}

export function getOptionBackgroundStyle(
  option: FilterOption,
  isSelected: boolean,
): CSSProperties | undefined {
  if (!option.color) return undefined;

  return {
    backgroundImage: isSelected
      ? `linear-gradient(90deg, color-mix(in oklch, ${option.color} 42%, var(--color-primary)) 0%, var(--color-primary) 72%)`
      : `linear-gradient(90deg, color-mix(in oklch, ${option.color} 28%, transparent) 0%, transparent 64%)`,
  };
}

export function clampRangeValue(range: FilterRange, value: number) {
  if (!Number.isFinite(value)) return range.min;
  return Math.min(Math.max(value, range.min), range.max);
}

export function normalizeRangeValue(
  range: FilterRange,
  value: FilterRangeValue,
): FilterRangeValue {
  const min = clampRangeValue(range, value.min);
  const max = clampRangeValue(range, value.max);

  return min <= max ? { min, max } : { min: max, max: min };
}

export function getRangeValue(
  range: FilterRange,
  selectedValues: string[],
): FilterRangeValue {
  const values = selectedValues
    .map(Number)
    .filter((value) => Number.isFinite(value));

  if (values.length === 0) {
    return { min: range.min, max: range.max };
  }

  if (values.length === 1) {
    return normalizeRangeValue(range, { min: range.min, max: values[0] });
  }

  return normalizeRangeValue(range, { min: values[0], max: values[1] });
}

export function isFullRangeValue(range: FilterRange, value: FilterRangeValue) {
  return value.min <= range.min && value.max >= range.max;
}

export function getRangeLabel(range: FilterRange, value: FilterRangeValue) {
  return range.valueLabel?.(value) ?? `${value.min}-${value.max}`;
}

export function getRangePercent(range: FilterRange, value: number) {
  if (range.max <= range.min) return 0;
  return ((value - range.min) / (range.max - range.min)) * 100;
}

export function getRangeMarkers(range: FilterRange, markerCount = 5) {
  if (range.max <= range.min) return [range.min];

  const step = range.step ?? 1;
  const possibleMarkerCount = Math.floor((range.max - range.min) / step) + 1;
  const markersLength = Math.min(markerCount, possibleMarkerCount);

  return Array.from({ length: markersLength }, (_, index) => {
    if (index === 0) return range.min;
    if (index === markersLength - 1) return range.max;

    const rawValue =
      range.min + ((range.max - range.min) * index) / (markersLength - 1);
    const snappedValue =
      range.min + Math.round((rawValue - range.min) / step) * step;

    return clampRangeValue(range, snappedValue);
  }).filter((marker, index, markers) => markers.indexOf(marker) === index);
}
