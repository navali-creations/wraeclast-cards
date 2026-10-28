export interface TimeBucketDatum {
  minute: number;
  count: number;
}

export interface TimeDistributionDatum extends TimeBucketDatum {
  activityShare: number;
  cardShare: number;
  sampleSize: number;
}

export interface TimeDistributionProfileData {
  activityTotal: number;
  buckets: TimeDistributionDatum[];
  cardTotal: number;
  maximumShare: number;
}

export interface NormalizedLocationDatum {
  name: string;
  count: number;
  lift: number;
  lowSample: boolean;
  sampleSize: number;
}

const THREE_HOUR_MINUTES = 3 * 60;
const QUARTER_HOUR_MINUTES = 15;
const MINUTES_PER_DAY = 24 * 60;
export const LOW_SAMPLE_THRESHOLD = 100;

export function formatMinuteOfDay(minute: number): string {
  const normalized =
    ((minute % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function buildQuarterHourBuckets(
  timeBuckets: Readonly<Record<string, number>>,
): TimeBucketDatum[] {
  return Array.from(
    { length: MINUTES_PER_DAY / QUARTER_HOUR_MINUTES },
    (_, index) => {
      const minute = index * QUARTER_HOUR_MINUTES;
      return { minute, count: timeBuckets[String(minute)] ?? 0 };
    },
  );
}

export function buildThreeHourBuckets(
  timeBuckets: Readonly<Record<string, number>>,
): TimeBucketDatum[] {
  const buckets = Array.from(
    { length: MINUTES_PER_DAY / THREE_HOUR_MINUTES },
    (_, index) => ({ minute: index * THREE_HOUR_MINUTES, count: 0 }),
  );

  for (const { minute, count } of buildQuarterHourBuckets(timeBuckets)) {
    buckets[Math.floor(minute / THREE_HOUR_MINUTES)].count += count;
  }

  return buckets;
}

export function buildTimeDistributionProfile(
  cardTimeBuckets: Readonly<Record<string, number>>,
  totalTimeBuckets: Readonly<Record<string, number>>,
): TimeDistributionProfileData {
  return buildDistributionProfile(
    buildThreeHourBuckets(cardTimeBuckets),
    buildThreeHourBuckets(totalTimeBuckets),
  );
}

export function buildQuarterHourDistributionProfile(
  cardTimeBuckets: Readonly<Record<string, number>>,
  totalTimeBuckets: Readonly<Record<string, number>>,
): TimeDistributionProfileData {
  return buildDistributionProfile(
    buildQuarterHourBuckets(cardTimeBuckets),
    buildQuarterHourBuckets(totalTimeBuckets),
  );
}

function buildDistributionProfile(
  cardBuckets: TimeBucketDatum[],
  totalBuckets: TimeBucketDatum[],
): TimeDistributionProfileData {
  const cardTotal = cardBuckets.reduce((sum, bucket) => sum + bucket.count, 0);
  const activityTotal = totalBuckets.reduce(
    (sum, bucket) => sum + bucket.count,
    0,
  );
  const buckets = cardBuckets.map((bucket, index) => {
    const sampleSize = totalBuckets[index]?.count ?? 0;
    return {
      ...bucket,
      sampleSize,
      cardShare: bucket.count / Math.max(cardTotal, 1),
      activityShare: sampleSize / Math.max(activityTotal, 1),
    };
  });
  const maximumShare = Math.max(
    ...buckets.flatMap((bucket) => [bucket.activityShare, bucket.cardShare]),
    0.01,
  );

  return { activityTotal, buckets, cardTotal, maximumShare };
}

export function buildNormalizedLocationData(
  cardLocations: Readonly<Record<string, number>>,
  totalLocations: Readonly<Record<string, number>>,
  locatedCardTotal: number,
): NormalizedLocationDatum[] {
  const locatedTotal = Object.values(totalLocations).reduce(
    (sum, count) => sum + count,
    0,
  );
  const overallRate = locatedTotal > 0 ? locatedCardTotal / locatedTotal : 0;
  if (overallRate <= 0) return [];

  return Object.entries(cardLocations)
    .flatMap(([name, count]) => {
      const sampleSize = totalLocations[name] ?? 0;
      if (name.trim().length === 0 || count <= 0 || sampleSize <= 0) return [];
      const rate = count / sampleSize;
      return [
        {
          name,
          count,
          sampleSize,
          lift: rate / overallRate,
          lowSample: sampleSize < LOW_SAMPLE_THRESHOLD,
        },
      ];
    })
    .sort((left, right) => {
      if (left.lowSample !== right.lowSample) return left.lowSample ? 1 : -1;
      return right.lift - left.lift || left.name.localeCompare(right.name);
    });
}

export function formatLift(lift: number | null): string {
  return lift === null || !Number.isFinite(lift) ? "—" : `${lift.toFixed(2)}×`;
}

export function formatReportCount(
  count: number,
  singular = "report",
  plural = "reports",
) {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

export function distributionBarHeight(
  share: number,
  maximum: number,
  minimum: number,
): string {
  if (share === 0) return "1px";
  return `${Math.max(minimum, (share / maximum) * 100)}%`;
}
