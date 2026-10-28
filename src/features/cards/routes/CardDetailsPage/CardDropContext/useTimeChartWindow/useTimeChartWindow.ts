import { useEffect, useRef, useState } from "react";
import {
  BUCKETS_PER_HOUR,
  clamp,
  MINIMUM_VISIBLE_BUCKETS,
  TOTAL_TIME_BUCKETS,
} from "../CardDropContext.utils/CardDropContext.utils";

interface TimeChartWindow {
  startBucket: number;
  visibleBucketCount: number;
}

const WHEEL_THRESHOLD = 40;
const ZOOM_STEP_BUCKETS = 8;

function snapToHour(bucket: number) {
  return Math.round(bucket / BUCKETS_PER_HOUR) * BUCKETS_PER_HOUR;
}

function normalizeWindow(
  startBucket: number,
  visibleBucketCount: number,
): TimeChartWindow {
  const visible = clamp(
    snapToHour(visibleBucketCount),
    MINIMUM_VISIBLE_BUCKETS,
    TOTAL_TIME_BUCKETS,
  );
  const start = clamp(snapToHour(startBucket), 0, TOTAL_TIME_BUCKETS - visible);
  return { startBucket: start, visibleBucketCount: visible };
}

export function useTimeChartWindow() {
  const [timeWindow, setTimeWindow] = useState<TimeChartWindow>({
    startBucket: 0,
    visibleBucketCount: TOTAL_TIME_BUCKETS,
  });
  const wheelDelta = useRef(0);
  const plotRef = useRef<HTMLDivElement>(null);

  function handleRangeChange(
    nextStartBucket: number,
    nextVisibleBucketCount: number,
  ) {
    setTimeWindow(normalizeWindow(nextStartBucket, nextVisibleBucketCount));
  }

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;

    const handleChartWheel = (event: WheelEvent) => {
      const bounds = plot.getBoundingClientRect();
      let deltaMultiplier = 1;
      if (event.deltaMode === 1) deltaMultiplier = 16;
      if (event.deltaMode === 2) deltaMultiplier = bounds.height;
      const delta = event.deltaY * deltaMultiplier;
      const wantsToZoomIn = delta < 0;
      const isAtRequestedLimit = wantsToZoomIn
        ? timeWindow.visibleBucketCount <= MINIMUM_VISIBLE_BUCKETS
        : timeWindow.visibleBucketCount >= TOTAL_TIME_BUCKETS;
      if (isAtRequestedLimit) {
        wheelDelta.current = 0;
        return;
      }

      event.preventDefault();
      wheelDelta.current += delta;
      if (Math.abs(wheelDelta.current) < WHEEL_THRESHOLD) return;

      const zoomDirection = wheelDelta.current < 0 ? -1 : 1;
      wheelDelta.current = 0;
      const pointerRatio =
        bounds.width > 0
          ? clamp((event.clientX - bounds.left) / bounds.width, 0, 1)
          : 0.5;

      setTimeWindow((current) => {
        const nextVisible = clamp(
          current.visibleBucketCount + zoomDirection * ZOOM_STEP_BUCKETS,
          MINIMUM_VISIBLE_BUCKETS,
          TOTAL_TIME_BUCKETS,
        );
        const anchorBucket =
          current.startBucket + pointerRatio * current.visibleBucketCount;
        return normalizeWindow(
          anchorBucket - pointerRatio * nextVisible,
          nextVisible,
        );
      });
    };

    plot.addEventListener("wheel", handleChartWheel, { passive: false });
    return () => plot.removeEventListener("wheel", handleChartWheel);
  }, [timeWindow.visibleBucketCount]);

  return {
    ...timeWindow,
    handleRangeChange,
    plotRef,
  };
}
