import clsx from "clsx";
import { useMemo } from "react";
import {
  buildNormalizedLocationData,
  formatLift,
} from "../../../stackedDecks/components/DropContextCharts/dropContext.utils";

const MINIMUM_INSIDE_LABEL_WIDTH = 45;

export function FeaturedLocationsChart({
  cardName,
  locations,
  locationTotals,
  locatedCardTotal,
}: {
  cardName: string;
  locations: Readonly<Record<string, number>>;
  locationTotals: Readonly<Record<string, number>>;
  locatedCardTotal: number;
}) {
  const rows = useMemo(
    () =>
      buildNormalizedLocationData(locations, locationTotals, locatedCardTotal)
        .filter((location) => !location.lowSample)
        .slice(0, 5),
    [locatedCardTotal, locationTotals, locations],
  );
  const maximum = Math.max(...rows.map((row) => row.lift), 1);

  if (rows.length === 0) {
    return (
      <span className="text-xs text-(--wc-text-50)">
        Not enough location data yet.
      </span>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${cardName} observed rate relative to its usual rate by Stacked Deck opening location`}
      className="space-y-1.5"
    >
      {rows.map((location) => {
        const width = (location.lift / maximum) * 100;
        const placeLabelInside = width >= MINIMUM_INSIDE_LABEL_WIDTH;

        return (
          <div
            key={location.name}
            className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-2 text-xs"
          >
            <span className="min-w-0 truncate text-left text-(--wc-text-80)">
              {location.name}
            </span>
            <span className="flex h-5 min-w-0 items-center">
              <span
                className={clsx(
                  "flex h-5 min-w-px shrink-0 items-center rounded-r-sm bg-(--wc-accent-border) font-semibold tabular-nums text-(--wc-gold-bright)",
                  placeLabelInside && "justify-end px-1.5",
                )}
                style={{ width: `${width}%` }}
              >
                {placeLabelInside && (
                  <span data-label-placement="inside">
                    {formatLift(location.lift)}
                  </span>
                )}
              </span>
              {!placeLabelInside && (
                <span
                  data-label-placement="outside"
                  className="ml-1.5 shrink-0 font-semibold tabular-nums text-(--wc-gold-bright)"
                >
                  {formatLift(location.lift)}
                </span>
              )}
            </span>
          </div>
        );
      })}
      <span className="sr-only">
        {rows
          .map(
            (location) =>
              `${location.name}: ${formatLift(location.lift)} from ${location.count.toLocaleString()} card observations among ${location.sampleSize.toLocaleString()} openings`,
          )
          .join("; ")}
      </span>
    </div>
  );
}
