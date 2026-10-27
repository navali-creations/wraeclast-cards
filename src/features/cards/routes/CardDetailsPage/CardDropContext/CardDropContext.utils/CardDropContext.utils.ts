export const BUCKETS_PER_HOUR = 4;
export const MINIMUM_VISIBLE_BUCKETS = 12;
export const TOTAL_TIME_BUCKETS = 24 * BUCKETS_PER_HOUR;

export type SliderKeyboardAction =
  | "decrease"
  | "increase"
  | "maximum"
  | "minimum";

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}

export function formatShare(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatTimeBucket(
  bucket: number,
  totalBuckets = TOTAL_TIME_BUCKETS,
) {
  if (bucket === totalBuckets) return "24:00";
  const minutes = bucket * (60 / BUCKETS_PER_HOUR);
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getSliderKeyboardAction(
  key: string,
): SliderKeyboardAction | null {
  if (key === "ArrowLeft" || key === "ArrowDown") return "decrease";
  if (key === "ArrowRight" || key === "ArrowUp") return "increase";
  if (key === "Home") return "minimum";
  if (key === "End") return "maximum";
  return null;
}
