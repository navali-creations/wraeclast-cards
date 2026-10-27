import { Text } from "../../../../components/text";
import { CardRarityBadge } from "../../../cards/routes/CardDetailsPage/CardRarityBadge/CardRarityBadge";
import { DropTimeMiniChart } from "../../../stackedDecks/components/DropContextCharts/DropTimeMiniChart";
import { FeaturedHelpTooltip } from "./FeaturedHelpTooltip";
import { FeaturedLocationsChart } from "./FeaturedLocationsChart";
import type { FeaturedCardCarouselEntry } from "./types";

export function FeaturedCardDetails({
  entry,
}: {
  entry: FeaturedCardCarouselEntry;
}) {
  const {
    card,
    locatedCardTotal,
    locations,
    locationTotals,
    rate,
    timeBuckets,
    timeBucketTotals,
  } = entry;
  const hasLocations =
    locatedCardTotal > 0 &&
    Object.values(locations).some((count) => count > 0) &&
    Object.values(locationTotals).some((count) => count > 0);

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-3 pb-3">
        <CardRarityBadge rarity={card.rarity} />
        <FeaturedHelpTooltip content="This card’s share of all reported Stacked Deck drops in the selected league.">
          <span className="inline-flex items-baseline gap-0.5 border-b border-dotted border-current text-sm font-semibold tabular-nums text-success">
            {rate ?? "—"}
            <sup className="text-[0.6em] leading-none text-current">?</sup>
          </span>
        </FeaturedHelpTooltip>
      </div>
      <div className="h-px w-full bg-linear-to-r from-transparent via-(--wc-text-60) to-transparent" />

      <section className="mt-4 pb-5">
        <Text
          weight="semibold"
          uppercase
          className="mb-2 text-[0.6rem] tracking-wider text-(--wc-text-60)"
        >
          By time of day
        </Text>
        <DropTimeMiniChart
          utcTimeBuckets={timeBuckets.utc}
          localTimeBuckets={timeBuckets.local}
          utcTotalBuckets={timeBucketTotals.utc}
          localTotalBuckets={timeBucketTotals.local}
          fluid
          size="large"
        />
      </section>
      <div className="h-px w-full bg-linear-to-r from-transparent via-(--wc-text-60) to-transparent" />

      <section className="mt-5">
        <div className="mb-2">
          <FeaturedHelpTooltip content="Opening location is the game area where players opened their Stacked Decks. Each value compares this card’s share there with its usual share across all recorded opening locations. 1.00× is usual.">
            <span className="inline-flex items-baseline gap-0.5 border-b border-dotted border-current text-[0.6rem] font-semibold tracking-wider text-(--wc-text-60) uppercase">
              By opening location
              <sup className="text-[0.75em] leading-none text-current">?</sup>
            </span>
          </FeaturedHelpTooltip>
        </div>
        {hasLocations ? (
          <FeaturedLocationsChart
            cardName={card.name}
            locations={locations}
            locationTotals={locationTotals}
            locatedCardTotal={locatedCardTotal}
          />
        ) : (
          <Text size="xs" className="py-3 text-(--wc-text-50)">
            No location context yet.
          </Text>
        )}
      </section>
    </div>
  );
}
