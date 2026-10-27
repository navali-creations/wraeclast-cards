import {
  buildQuarterHourDistributionProfile,
  distributionBarHeight,
} from "../../../../../stackedDecks/components/DropContextCharts/dropContext.utils";
import {
  BUCKETS_PER_HOUR,
  formatShare,
} from "../CardDropContext.utils/CardDropContext.utils";
import { TimeChartHoverLayer } from "../TimeChartHoverLayer/TimeChartHoverLayer";
import { TimeRangeNavigator } from "../TimeRangeNavigator/TimeRangeNavigator";
import { useTimeChartWindow } from "../useTimeChartWindow/useTimeChartWindow";

interface QuarterHourDistributionChartProps {
  cardBuckets: Readonly<Record<string, number>>;
  label: string;
  totalBuckets: Readonly<Record<string, number>>;
}

const Y_AXIS_STEP = 0.1;

export function QuarterHourDistributionChart({
  cardBuckets,
  label,
  totalBuckets,
}: QuarterHourDistributionChartProps) {
  const { handleRangeChange, plotRef, startBucket, visibleBucketCount } =
    useTimeChartWindow();
  const profile = buildQuarterHourDistributionProfile(
    cardBuckets,
    totalBuckets,
  );
  const visibleBuckets = profile.buckets.slice(
    startBucket,
    startBucket + visibleBucketCount,
  );
  const maximumVisibleShare = Math.max(
    ...visibleBuckets.flatMap((bucket) => [
      bucket.activityShare,
      bucket.cardShare,
    ]),
    0.01,
  );
  const axisMaximum = Math.max(
    Y_AXIS_STEP,
    Math.ceil(maximumVisibleShare / Y_AXIS_STEP) * Y_AXIS_STEP,
  );
  const yAxisTicks = Array.from(
    { length: Math.round(axisMaximum / Y_AXIS_STEP) + 1 },
    (_, index) => axisMaximum - index * Y_AXIS_STEP,
  );
  const visibleHours = visibleBucketCount / BUCKETS_PER_HOUR;
  const labelInterval = visibleHours >= 24 ? 3 : visibleHours >= 12 ? 2 : 1;
  const hourTicks = Array.from({ length: visibleHours }, (_, index) => ({
    hour: startBucket / BUCKETS_PER_HOUR + index,
    visible: index % labelInterval === 0,
  }));
  return (
    <figure
      aria-label={`${label} distribution of reports for this card compared with all reports that include time data`}
      className="w-full min-w-0"
    >
      <div className="mb-2 grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2 text-[0.65rem] font-medium text-(--wc-text-dimmed)">
        <span className="pr-1 text-right">Share</span>
        <span className="text-right">{label}</span>
      </div>
      <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2">
        <div className="flex h-32 flex-col justify-between pr-1 text-right text-[0.6rem] leading-none tabular-nums text-(--wc-text-dimmed)">
          {yAxisTicks.map((tick) => (
            <span key={tick}>{formatShare(tick)}</span>
          ))}
        </div>
        <div
          ref={plotRef}
          data-testid="time-distribution-plot"
          className="relative h-32 min-w-0 overflow-hidden border-b border-l border-(--wc-text-dimmed)/45"
        >
          <span className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {yAxisTicks.map((tick) => (
              <span
                key={tick}
                className="border-t border-dashed border-(--wc-text-dimmed)/20 first:border-solid"
              />
            ))}
          </span>
          <span
            className="pointer-events-none absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${visibleHours}, minmax(0, 1fr))`,
            }}
          >
            {hourTicks.map(({ hour }) => (
              <span
                key={hour}
                className="border-l border-dashed border-(--wc-text-dimmed)/12 first:border-l-0"
              />
            ))}
          </span>
          <div className="absolute inset-0 flex items-end">
            {visibleBuckets.map((bucket) => {
              const bucketMaximum = Math.max(
                bucket.cardShare,
                bucket.activityShare,
              );
              const anchorHeight = distributionBarHeight(
                bucketMaximum,
                axisMaximum,
                2,
              );

              return (
                <span
                  key={bucket.minute}
                  data-time-bucket={bucket.minute}
                  className="relative min-w-0 flex-1 self-end"
                  style={{ height: anchorHeight }}
                >
                  <span className="flex h-full items-end justify-center gap-px">
                    <span
                      aria-hidden="true"
                      className="max-w-1 shrink rounded-t-sm bg-(--wc-accent-border)"
                      style={{
                        height: distributionBarHeight(
                          bucket.cardShare,
                          bucketMaximum,
                          1,
                        ),
                        opacity: bucket.cardShare === 0 ? 0.18 : 1,
                        width: "min(4px, calc((100% - 1px) / 2))",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="max-w-1 shrink rounded-t-sm bg-(--wc-text-dimmed)/55"
                      style={{
                        height: distributionBarHeight(
                          bucket.activityShare,
                          bucketMaximum,
                          1,
                        ),
                        opacity: bucket.activityShare === 0 ? 0.18 : 0.8,
                        width: "min(4px, calc((100% - 1px) / 2))",
                      }}
                    />
                  </span>
                </span>
              );
            })}
          </div>
          <TimeChartHoverLayer buckets={visibleBuckets} label={label} />
        </div>
        <span />
        <div
          className="grid pt-1.5 text-[0.6rem] tabular-nums text-(--wc-text-dimmed)"
          style={{
            gridTemplateColumns: `repeat(${visibleHours}, minmax(0, 1fr))`,
          }}
        >
          {hourTicks.map(({ hour, visible }) => (
            <span key={hour}>
              {visible ? `${String(hour % 24).padStart(2, "0")}:00` : null}
            </span>
          ))}
        </div>
        <span />
        <TimeRangeNavigator
          buckets={profile.buckets}
          onRangeChange={handleRangeChange}
          startBucket={startBucket}
          visibleBuckets={visibleBucketCount}
        />
        <span />
        <span className="pt-1 text-center text-[0.65rem] font-medium text-(--wc-text-dimmed)">
          Time of day
        </span>
      </div>
      <span className="sr-only">
        {profile.cardTotal.toLocaleString()} reports for this card and{" "}
        {profile.activityTotal.toLocaleString()} total reports include {label}
        time data.
      </span>
    </figure>
  );
}
