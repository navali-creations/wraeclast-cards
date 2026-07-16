import clsx from "clsx";
import type {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react";
import { useRef, useState } from "react";

type NativeRangeSliderValue = {
  min: number;
  max: number;
};

interface NativeRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: NativeRangeSliderValue;
  minLabel: string;
  maxLabel: string;
  valueText?: string;
  className?: string;
  onValueChange: (value: NativeRangeSliderValue) => void;
  onValueCommit: (value: NativeRangeSliderValue) => void;
}

type RangeHandle = "min" | "max";

const COMMIT_KEYS = new Set([
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);
const TRACK_INSET = 8;

function isRangeHandle(value: string | undefined): value is RangeHandle {
  return value === "min" || value === "max";
}

function getPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function NativeRangeSlider({
  min,
  max,
  step = 1,
  value,
  minLabel,
  maxLabel,
  valueText,
  className,
  onValueChange,
  onValueCommit,
}: NativeRangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);
  const activeHandleRef = useRef<RangeHandle>("max");
  const [activeHandle, setActiveHandle] = useState<RangeHandle>("max");
  const isSingleValue = max <= min;
  const minPercent = isSingleValue ? 0 : getPercent(value.min, min, max);
  const maxPercent = isSingleValue ? 100 : getPercent(value.max, min, max);

  const setActiveRangeHandle = (handle: RangeHandle) => {
    activeHandleRef.current = handle;
    setActiveHandle(handle);
  };

  const focusRangeHandle = (handle: RangeHandle) => {
    const inputRef = handle === "min" ? minInputRef : maxInputRef;
    inputRef.current?.focus({ preventScroll: true });
  };

  const getNextValue = (handle: RangeHandle, nextValue: number) => {
    const safeValue = clamp(nextValue, min, max);

    if (handle === "min") {
      return {
        min: Math.min(safeValue, value.max),
        max: value.max,
      };
    }

    return {
      min: value.min,
      max: Math.max(safeValue, value.min),
    };
  };

  const getPointerValue = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return undefined;

    const trackLeft = rect.left + TRACK_INSET;
    const trackWidth = Math.max(1, rect.width - TRACK_INSET * 2);
    const ratio = clamp((clientX - trackLeft) / trackWidth, 0, 1);
    const rawValue = min + ratio * (max - min);

    return min + Math.round((rawValue - min) / step) * step;
  };

  const getPointerHandle = (pointerValue: number): RangeHandle => {
    const minDistance = Math.abs(pointerValue - value.min);
    const maxDistance = Math.abs(pointerValue - value.max);

    if (minDistance === maxDistance) {
      if (value.min === value.max) {
        return pointerValue < value.min ? "min" : "max";
      }

      return activeHandleRef.current;
    }

    return minDistance < maxDistance ? "min" : "max";
  };

  const getEventValue = (
    event:
      | ChangeEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | PointerEvent<HTMLInputElement>,
  ) => {
    const { rangeHandle } = event.currentTarget.dataset;
    if (!isRangeHandle(rangeHandle)) return undefined;
    setActiveRangeHandle(rangeHandle);
    return getNextValue(rangeHandle, Number(event.currentTarget.value));
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = getEventValue(event);
    if (nextValue) onValueChange(nextValue);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isSingleValue) return;

    const pointerValue = getPointerValue(event.clientX);
    if (pointerValue === undefined) return;

    event.preventDefault();
    const rangeHandle = getPointerHandle(pointerValue);
    setActiveRangeHandle(rangeHandle);
    focusRangeHandle(rangeHandle);
    onValueChange(getNextValue(rangeHandle, pointerValue));
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const pointerValue = getPointerValue(event.clientX);
    if (pointerValue === undefined) return;

    onValueChange(getNextValue(activeHandleRef.current, pointerValue));
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

    const pointerValue = getPointerValue(event.clientX);
    if (pointerValue !== undefined) {
      onValueCommit(getNextValue(activeHandleRef.current, pointerValue));
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleValueCommit = (event: KeyboardEvent<HTMLInputElement>) => {
    const nextValue = getEventValue(event);
    if (nextValue) onValueCommit(nextValue);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (COMMIT_KEYS.has(event.key)) handleValueCommit(event);
  };

  return (
    <div
      ref={sliderRef}
      className={clsx("relative h-8 w-full touch-none", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-2 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#d8c8a4]"
      >
        <div
          className="absolute inset-y-0 rounded-full bg-(--color-primary)"
          style={
            {
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            } satisfies CSSProperties
          }
        />
      </div>
      <input
        ref={minInputRef}
        type="range"
        aria-label={minLabel}
        aria-valuetext={valueText}
        data-range-handle="min"
        min={min}
        max={max}
        step={step}
        value={value.min}
        disabled={isSingleValue}
        onChange={handleValueChange}
        onKeyUp={handleKeyUp}
        className={clsx("wc-native-range absolute inset-0 h-8 w-full", {
          "z-30": activeHandle === "min",
          "z-20": activeHandle !== "min",
        })}
      />
      <input
        ref={maxInputRef}
        type="range"
        aria-label={maxLabel}
        aria-valuetext={valueText}
        data-range-handle="max"
        min={min}
        max={max}
        step={step}
        value={value.max}
        disabled={isSingleValue}
        onChange={handleValueChange}
        onKeyUp={handleKeyUp}
        className={clsx("wc-native-range absolute inset-0 h-8 w-full", {
          "z-30": activeHandle === "max",
          "z-20": activeHandle !== "max",
        })}
      />
    </div>
  );
}
