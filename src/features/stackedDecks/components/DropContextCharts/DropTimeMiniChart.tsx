import clsx from "clsx";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { DropTimeRateTooltip } from "./DropTimeRateTooltip";
import {
  buildTimeDistributionProfile,
  distributionBarHeight,
  formatMinuteOfDay,
} from "./dropContext.utils";
import { useDropTimePopover } from "./useDropTimePopover";

interface DropTimeMiniChartProps {
  utcTimeBuckets: Readonly<Record<string, number>>;
  localTimeBuckets: Readonly<Record<string, number>>;
  utcTotalBuckets: Readonly<Record<string, number>>;
  localTotalBuckets: Readonly<Record<string, number>>;
  fluid?: boolean;
  size?: "compact" | "large";
  showTooltip?: boolean;
}

export function DropTimeMiniChart({
  utcTimeBuckets,
  localTimeBuckets,
  utcTotalBuckets,
  localTotalBuckets,
  fluid = false,
  size = "compact",
  showTooltip = true,
}: DropTimeMiniChartProps) {
  const chartRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popover = useDropTimePopover(chartRef, popoverRef);
  const utcProfile = buildTimeDistributionProfile(
    utcTimeBuckets,
    utcTotalBuckets,
  );
  const localProfile = buildTimeDistributionProfile(
    localTimeBuckets,
    localTotalBuckets,
  );
  const hasUtcComparison =
    utcProfile.cardTotal > 0 && utcProfile.activityTotal > 0;
  const hasLocalComparison =
    localProfile.cardTotal > 0 && localProfile.activityTotal > 0;
  const usesPlayerTimeFallback = !hasUtcComparison && hasLocalComparison;
  const displayedProfile = usesPlayerTimeFallback ? localProfile : utcProfile;
  const isLarge = size === "large";

  if (!hasUtcComparison && !hasLocalComparison) {
    return <span className="text-xs text-(--wc-text-50)">—</span>;
  }

  const chartContent = displayedProfile.buckets.map((bucket) => {
    const time = formatMinuteOfDay(bucket.minute);

    return (
      <span
        key={bucket.minute}
        className={clsx(
          "flex shrink-0 flex-col items-center",
          fluid ? "flex-1" : "w-2.5",
        )}
      >
        <span
          className={clsx(
            "flex items-end justify-center gap-px",
            isLarge ? "h-6" : "h-3.5",
          )}
        >
          <span
            className="w-1 rounded-t-sm bg-(--wc-accent-border)"
            style={{
              height: distributionBarHeight(
                bucket.cardShare,
                displayedProfile.maximumShare,
                isLarge ? 8 : 12,
              ),
              opacity: bucket.cardShare === 0 ? 0.18 : 1,
            }}
          />
          <span
            className="w-1 rounded-t-sm bg-(--wc-text-50)"
            style={{
              height: distributionBarHeight(
                bucket.activityShare,
                displayedProfile.maximumShare,
                isLarge ? 8 : 12,
              ),
              opacity: bucket.activityShare === 0 ? 0.18 : 0.7,
            }}
          />
        </span>
        <span
          aria-hidden="true"
          className={clsx(
            "mt-0.5 leading-none tabular-nums text-(--wc-text-50)",
            isLarge ? "text-[9px]" : "text-[8px]",
          )}
        >
          {time.slice(0, 2)}
        </span>
      </span>
    );
  });
  const chartClassName = clsx(
    "inline-flex appearance-none items-start rounded-sm border-0 bg-transparent p-0",
    isLarge ? "h-8 gap-1" : "h-6 gap-0.5",
    fluid && "w-full justify-between",
  );
  const ariaLabel = usesPlayerTimeFallback
    ? "Compare when this card was reported with all reported cards that include time data, using each player’s timezone"
    : "Compare when this card was reported with all reported cards that include time data, using global time";

  return (
    <>
      {showTooltip ? (
        <button
          type="button"
          ref={chartRef}
          aria-label={ariaLabel}
          className={`${chartClassName} cursor-help focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-(--wc-gold)`}
          onMouseEnter={popover.show}
          onMouseLeave={popover.hide}
          onFocus={popover.show}
          onBlur={popover.hide}
          onClick={popover.show}
          onKeyDown={popover.handleKeyDown}
        >
          {chartContent}
        </button>
      ) : (
        <div role="img" aria-label={ariaLabel} className={chartClassName}>
          {chartContent}
        </div>
      )}

      {showTooltip &&
        popover.isOpen &&
        popover.position &&
        typeof document !== "undefined" &&
        createPortal(
          <DropTimeRateTooltip
            localProfile={localProfile}
            popoverRef={popoverRef}
            position={popover.position}
            total={displayedProfile.cardTotal}
            utcProfile={utcProfile}
          />,
          document.body,
        )}
    </>
  );
}
