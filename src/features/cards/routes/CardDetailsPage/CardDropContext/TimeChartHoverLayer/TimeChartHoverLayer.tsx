import type { TimeDistributionDatum } from "../../../../../stackedDecks/components/DropContextCharts/dropContext.utils";
import { TimeChartPopover } from "../TimeChartPopover/TimeChartPopover";
import { useTimeChartHover } from "../useTimeChartHover/useTimeChartHover";

export function TimeChartHoverLayer({
  buckets,
  label,
}: {
  buckets: ReadonlyArray<TimeDistributionDatum>;
  label: string;
}) {
  const {
    handlePlotPointerLeave,
    handlePlotPointerMove,
    hoverLineRef,
    hoveredBucket,
  } = useTimeChartHover(buckets.length);
  const activeBucket =
    hoveredBucket === null ? null : buckets[hoveredBucket.index];

  return (
    <div
      data-testid="time-distribution-hover-layer"
      className="absolute inset-0 z-20"
      onPointerCancel={handlePlotPointerLeave}
      onPointerLeave={handlePlotPointerLeave}
      onPointerMove={handlePlotPointerMove}
      onWheel={handlePlotPointerLeave}
    >
      <span
        ref={hoverLineRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 border-l border-dashed border-(--wc-accent-border)/70 invisible"
        style={{ transform: "translateX(-0.5px)" }}
      />
      {hoveredBucket && activeBucket && (
        <TimeChartPopover
          bucket={activeBucket}
          label={label}
          pointerX={hoveredBucket.pointerX}
          pointerY={hoveredBucket.pointerY}
        />
      )}
    </div>
  );
}
