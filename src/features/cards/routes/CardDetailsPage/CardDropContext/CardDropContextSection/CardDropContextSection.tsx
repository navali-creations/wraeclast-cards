import { Text } from "../../../../../../components/text";
import { CardTimeContextChart } from "../CardTimeContextChart/CardTimeContextChart";
import { LocationContextChart } from "../LocationContextChart/LocationContextChart";
import { useCardDropContext } from "../useCardDropContext/useCardDropContext";

function hasReports(buckets: Readonly<Record<string, number>>) {
  return Object.values(buckets).some((count) => count > 0);
}

export function CardDropContextSection({ cardName }: { cardName: string }) {
  const context = useCardDropContext(cardName);
  const hasTimeData =
    hasReports(context.timeBuckets.utc) ||
    hasReports(context.timeBuckets.local);
  const hasLocationData = context.locationRows.length > 0;
  const hasTimeError = Boolean(context.timeStatus.error);
  const hasLocationError = Boolean(context.locationStatus.error);
  const hasError = hasTimeError || hasLocationError;
  const isLoading =
    context.timeStatus.isLoading || context.locationStatus.isLoading;
  const isEmpty = !isLoading && !hasError && !hasTimeData && !hasLocationData;

  return (
    <section aria-label="Reported context">
      {isEmpty && (
        <Text
          size="sm"
          className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 text-(--wc-text-dimmed) sm:p-5"
        >
          No time or opening-location context has been reported for this card
          yet.
        </Text>
      )}
      <div className="space-y-4">
        {context.timeStatus.isLoading && (
          <div
            role="status"
            aria-label="Loading time-of-day context"
            className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 sm:p-5"
          >
            <div className="skeleton h-48 w-full" />
          </div>
        )}
        {!context.timeStatus.isLoading && hasTimeError && (
          <Text
            size="sm"
            className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 text-(--wc-text-dimmed) sm:p-5"
          >
            Reported time-of-day context could not be loaded.
          </Text>
        )}
        {!context.timeStatus.isLoading && !hasTimeError && hasTimeData && (
          <CardTimeContextChart
            cardBuckets={context.timeBuckets}
            totalBuckets={context.timeBucketTotals}
          />
        )}
        {context.locationStatus.isLoading && (
          <div
            role="status"
            aria-label="Loading opening-location context"
            className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 sm:p-5"
          >
            <div className="skeleton h-36 w-full" />
          </div>
        )}
        {!context.locationStatus.isLoading && hasLocationError && (
          <Text
            size="sm"
            className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-4 text-(--wc-text-dimmed) sm:p-5"
          >
            Reported opening-location context could not be loaded.
          </Text>
        )}
        {!context.locationStatus.isLoading &&
          !hasLocationError &&
          hasLocationData && (
            <LocationContextChart
              cardName={cardName}
              rows={context.locationRows}
            />
          )}
      </div>
    </section>
  );
}
