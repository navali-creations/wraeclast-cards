import clsx from "clsx";
import type { TimeDistributionDatum } from "../../../../../stackedDecks/components/DropContextCharts/dropContext.utils";
import {
  formatTimeBucket,
  MINIMUM_VISIBLE_BUCKETS,
} from "../CardDropContext.utils/CardDropContext.utils";
import { useTimeRangeBrush } from "./useTimeRangeBrush/useTimeRangeBrush";

interface TimeRangeNavigatorProps {
  buckets: ReadonlyArray<TimeDistributionDatum>;
  onRangeChange: (startBucket: number, visibleBuckets: number) => void;
  startBucket: number;
  visibleBuckets: number;
}

function createOverviewPoints(
  buckets: ReadonlyArray<TimeDistributionDatum>,
  value: "activityShare" | "cardShare",
  maximum: number,
) {
  return buckets
    .map((bucket, index) => {
      const x = (index / Math.max(buckets.length - 1, 1)) * 100;
      const y = 27 - (bucket[value] / maximum) * 23;
      return `${x},${y}`;
    })
    .join(" ");
}

export function TimeRangeNavigator({
  buckets,
  onRangeChange,
  startBucket,
  visibleBuckets,
}: TimeRangeNavigatorProps) {
  const totalBuckets = buckets.length;
  const {
    dragMode,
    handleEndKeyDown,
    handleEndPointerDown,
    handleMoveKeyDown,
    handleMovePointerDown,
    handlePointerEnd,
    handlePointerMove,
    handleStartKeyDown,
    handleStartPointerDown,
    handleTrackPointerDown,
    trackRef,
  } = useTimeRangeBrush({
    onRangeChange,
    startBucket,
    totalBuckets,
    visibleBuckets,
  });
  const selectionLeft = (startBucket / totalBuckets) * 100;
  const selectionWidth = (visibleBuckets / totalBuckets) * 100;
  const selectionRight = selectionLeft + selectionWidth;
  const selectionRightInset = 100 - selectionRight;
  const endBucket = startBucket + visibleBuckets;
  const visibleRangeText = `${formatTimeBucket(startBucket, totalBuckets)}–${formatTimeBucket(endBucket, totalBuckets)}`;
  const maximumShare = Math.max(
    ...buckets.flatMap((bucket) => [bucket.activityShare, bucket.cardShare]),
    0.01,
  );
  const cardPoints = createOverviewPoints(buckets, "cardShare", maximumShare);
  const activityPoints = createOverviewPoints(
    buckets,
    "activityShare",
    maximumShare,
  );

  return (
    <div
      ref={trackRef}
      data-testid="time-range-overview"
      className={clsx(
        "relative mt-2 h-10 touch-none select-none rounded-sm border border-(--wc-text-dimmed)/20 bg-(--wc-text-dimmed)/5",
        {
          "cursor-ew-resize": dragMode === "end" || dragMode === "start",
          "cursor-grabbing": dragMode === "move",
        },
      )}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handleTrackPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 28"
      >
        <polygon
          fill="var(--wc-accent-border)"
          fillOpacity="0.08"
          points={`0,28 ${cardPoints} 100,28`}
        />
        <polyline
          fill="none"
          points={activityPoints}
          stroke="var(--wc-text-dimmed)"
          strokeOpacity="0.45"
          strokeWidth="0.7"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          fill="none"
          points={cardPoints}
          stroke="var(--wc-accent-border)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Pan visible time window"
        aria-orientation="horizontal"
        aria-valuemax={totalBuckets - visibleBuckets}
        aria-valuemin={0}
        aria-valuenow={startBucket}
        aria-valuetext={visibleRangeText}
        className="absolute inset-y-0 z-20 cursor-grab border-y border-(--wc-accent-border) bg-(--wc-accent-border)/8 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--wc-accent-border) active:cursor-grabbing"
        onKeyDown={handleMoveKeyDown}
        onPointerDown={handleMovePointerDown}
        style={{
          left: `${selectionLeft}%`,
          right: `${selectionRightInset}%`,
        }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Adjust visible time window start"
        aria-orientation="horizontal"
        aria-valuemax={startBucket + visibleBuckets - MINIMUM_VISIBLE_BUCKETS}
        aria-valuemin={0}
        aria-valuenow={startBucket}
        aria-valuetext={formatTimeBucket(startBucket, totalBuckets)}
        className={clsx(
          "absolute inset-y-0 z-30 flex w-3 -translate-x-1/2 cursor-ew-resize items-center focus-visible:outline-2 focus-visible:outline-(--wc-accent-border)",
          {
            "justify-center": startBucket !== 0,
            "justify-start": startBucket === 0,
          },
        )}
        onKeyDown={handleStartKeyDown}
        onPointerDown={handleStartPointerDown}
        style={{
          left: `clamp(0.375rem, ${selectionLeft}%, calc(100% - 0.375rem))`,
        }}
      >
        <span className="h-full w-1.5 rounded-sm border border-(--wc-accent-border) bg-(--wc-accent-border)" />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Adjust visible time window end"
        aria-orientation="horizontal"
        aria-valuemax={totalBuckets}
        aria-valuemin={startBucket + MINIMUM_VISIBLE_BUCKETS}
        aria-valuenow={endBucket}
        aria-valuetext={formatTimeBucket(endBucket, totalBuckets)}
        className={clsx(
          "absolute inset-y-0 z-30 flex w-3 -translate-x-1/2 cursor-ew-resize items-center focus-visible:outline-2 focus-visible:outline-(--wc-accent-border)",
          {
            "justify-center": endBucket !== totalBuckets,
            "justify-end": endBucket === totalBuckets,
          },
        )}
        onKeyDown={handleEndKeyDown}
        onPointerDown={handleEndPointerDown}
        style={{
          left: `clamp(0.375rem, ${selectionRight}%, calc(100% - 0.375rem))`,
        }}
      >
        <span className="h-full w-1.5 rounded-sm border border-(--wc-accent-border) bg-(--wc-accent-border)" />
      </div>
      <span className="sr-only">
        Scroll over the chart to zoom. Drag this window to pan or drag either
        handle to resize it.
      </span>
      {dragMode && <span className="sr-only">Adjusting {dragMode}</span>}
    </div>
  );
}
