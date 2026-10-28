import clsx from "clsx";
import { Fragment } from "react";
import {
  formatLift,
  formatReportCount,
  type NormalizedLocationDatum,
} from "../../../../../stackedDecks/components/DropContextCharts/dropContext.utils";
import { ContextInfoTooltip } from "../ContextInfoTooltip/ContextInfoTooltip";

const MAXIMUM_VISIBLE_LOCATIONS = 10;
const MINIMUM_INSIDE_LABEL_WIDTH = 22;

export function LocationContextChart({
  cardName,
  rows,
}: {
  cardName: string;
  rows: ReadonlyArray<NormalizedLocationDatum>;
}) {
  const visibleRows = rows.slice(0, MAXIMUM_VISIBLE_LOCATIONS);
  if (visibleRows.length === 0) return null;

  const maximum = Math.max(...visibleRows.map((row) => row.lift), 1);
  const usualPosition = (1 / maximum) * 100;

  return (
    <section
      aria-labelledby="card-location-context-title"
      className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            id="card-location-context-title"
            className="text-sm font-semibold text-(--wc-card-name)"
          >
            By opening location
          </h3>
          <p className="mt-1 text-xs text-(--wc-text-dimmed)">
            Observed share compared with this card’s usual share
          </p>
        </div>
        <ContextInfoTooltip label="About opening-location reporting">
          1.00× is this card’s usual observed share. Values compare
          like-for-like reports at each opening location; faded rows have a
          small sample.
        </ContextInfoTooltip>
      </div>

      <div
        role="img"
        aria-label={`${cardName} reporting rate relative to its usual rate by Stacked Deck opening location`}
        className="mt-4 space-y-3"
      >
        <div className="grid grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)] gap-3 text-[0.6rem] text-(--wc-text-dimmed)">
          <span />
          <span className="relative h-3">
            <span
              className="absolute -translate-x-1/2"
              style={{ left: `${usualPosition}%` }}
            >
              1.00
            </span>
          </span>
        </div>
        <div className="relative grid grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)] items-center gap-x-3 gap-y-3">
          <span
            aria-hidden="true"
            className="pointer-events-none relative z-0 col-start-2 row-start-1 h-full"
            style={{ gridRow: `1 / span ${visibleRows.length}` }}
          >
            <span
              className="absolute inset-y-0 border-l border-dashed border-(--wc-text-dimmed)/40"
              style={{ left: `${usualPosition}%` }}
            />
          </span>
          {visibleRows.map((location, index) => {
            const width = (location.lift / maximum) * 100;
            const placeLabelInside = width >= MINIMUM_INSIDE_LABEL_WIDTH;
            const row = index + 1;

            return (
              <Fragment key={location.name}>
                <span
                  className={clsx(
                    "z-1 min-w-0 text-xs font-semibold text-(--wc-card-name)",
                    location.lowSample && "opacity-75",
                  )}
                  style={{ gridColumn: 1, gridRow: row }}
                >
                  <span className="block truncate">{location.name}</span>
                  <span className="mt-0.5 block text-[0.65rem] font-normal tabular-nums text-(--wc-text-dimmed)">
                    {formatReportCount(
                      location.count,
                      "card report",
                      "card reports",
                    )}{" "}
                    / {location.sampleSize.toLocaleString()} openings
                    {location.lowSample && " · small sample"}
                  </span>
                </span>
                <span
                  className={clsx(
                    "relative z-1 flex h-7 min-w-0 items-center",
                    location.lowSample && "opacity-75",
                  )}
                  style={{ gridColumn: 2, gridRow: row }}
                >
                  <span
                    className={clsx(
                      "flex h-6 min-w-px shrink-0 items-center rounded-r-sm bg-(--wc-accent-border) text-xs font-semibold tabular-nums text-(--wc-gold-bright)",
                      placeLabelInside && "justify-end px-2",
                    )}
                    style={{ width: `${width}%` }}
                  >
                    {placeLabelInside && formatLift(location.lift)}
                  </span>
                  {!placeLabelInside && (
                    <span className="ml-2 shrink-0 text-xs font-semibold tabular-nums text-(--wc-gold-bright)">
                      {formatLift(location.lift)}
                    </span>
                  )}
                </span>
              </Fragment>
            );
          })}
        </div>
        <span className="sr-only">
          {visibleRows
            .map(
              (location) =>
                `${location.name}: ${formatLift(location.lift)} from ${formatReportCount(location.count, "card report", "card reports")} among ${location.sampleSize.toLocaleString()} openings`,
            )
            .join("; ")}
        </span>
      </div>
    </section>
  );
}
