import type { CardTimeBuckets } from "../../../../lib/dropRates";
import type { Card } from "../../../cards/types";

export interface FeaturedCardCarouselEntry {
  card: Card;
  locations: Readonly<Record<string, number>>;
  locationTotals: Readonly<Record<string, number>>;
  locatedCardTotal: number;
  rate: string;
  timeBuckets: CardTimeBuckets;
  timeBucketTotals: CardTimeBuckets;
}
