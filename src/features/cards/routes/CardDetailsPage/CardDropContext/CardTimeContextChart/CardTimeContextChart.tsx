import { useState } from "react";
import type { CardTimeBuckets } from "../../../../../../lib/dropRates";
import { ContextInfoTooltip } from "../ContextInfoTooltip/ContextInfoTooltip";
import { QuarterHourDistributionChart } from "../QuarterHourDistributionChart/QuarterHourDistributionChart";

type TimePerspective = "utc" | "local";

function totalReports(buckets: Readonly<Record<string, number>>) {
  return Object.values(buckets).reduce((sum, count) => sum + count, 0);
}

export function CardTimeContextChart({
  cardBuckets,
  totalBuckets,
}: {
  cardBuckets: CardTimeBuckets;
  totalBuckets: CardTimeBuckets;
}) {
  const [requestedPerspective, setRequestedPerspective] =
    useState<TimePerspective>("utc");
  const hasUtc = totalReports(cardBuckets.utc) > 0;
  const hasLocal = totalReports(cardBuckets.local) > 0;
  const perspective =
    requestedPerspective === "utc"
      ? hasUtc
        ? "utc"
        : "local"
      : hasLocal
        ? "local"
        : "utc";
  const label = perspective === "utc" ? "Global (UTC)" : "Player time";

  function handleUtcClick() {
    setRequestedPerspective("utc");
  }

  function handleLocalClick() {
    setRequestedPerspective("local");
  }

  return (
    <section
      aria-labelledby="card-time-context-title"
      className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3
            id="card-time-context-title"
            className="text-sm font-semibold text-(--wc-card-name)"
          >
            By time of day
          </h3>
          <p className="mt-1 text-xs text-(--wc-text-dimmed)">
            15-minute reporting windows
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ContextInfoTooltip label="About time-of-day reporting">
            <span className="block">
              These are reporting patterns, not a time-based drop chance.
              Compare this card with overall reporting activity in the same time
              window.
            </span>
            <span className="mt-2 block">
              Global UTC uses one shared clock; Player time uses each reporter’s
              timezone.
            </span>
          </ContextInfoTooltip>
          <fieldset className="inline-flex rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)/70 p-1 text-xs font-normal">
            <legend className="sr-only">Time perspective</legend>
            <button
              type="button"
              aria-pressed={perspective === "utc"}
              disabled={!hasUtc}
              className="rounded-md px-2.5 py-1.5 text-(--wc-text-50) aria-pressed:bg-(--wc-glow) aria-pressed:text-(--wc-gold-bright) disabled:cursor-not-allowed disabled:opacity-35"
              onClick={handleUtcClick}
            >
              Global (UTC)
            </button>
            <button
              type="button"
              aria-pressed={perspective === "local"}
              disabled={!hasLocal}
              className="rounded-md px-2.5 py-1.5 text-(--wc-text-50) aria-pressed:bg-(--wc-glow) aria-pressed:text-(--wc-gold-bright) disabled:cursor-not-allowed disabled:opacity-35"
              onClick={handleLocalClick}
            >
              Player time
            </button>
          </fieldset>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-(--wc-text-dimmed)">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-(--wc-accent-border)" />
          This card
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-(--wc-text-dimmed)/55" />
          All reports with time data
        </span>
      </div>

      <div className="mt-3">
        <QuarterHourDistributionChart
          cardBuckets={cardBuckets[perspective]}
          totalBuckets={totalBuckets[perspective]}
          label={label}
        />
      </div>
    </section>
  );
}
