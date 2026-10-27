import {
  distributionBarHeight,
  formatMinuteOfDay,
  type TimeDistributionProfileData,
} from "./dropContext.utils";

export function TimeDistributionProfile({
  label,
  profile,
}: {
  label: string;
  profile: TimeDistributionProfileData;
}) {
  if (profile.cardTotal === 0 || profile.activityTotal === 0) return null;

  return (
    <section aria-label={label} className="mt-3">
      <p className="mb-1 text-[0.65rem] font-semibold tracking-wide text-(--wc-text-70) uppercase">
        {label}
      </p>
      <div className="grid grid-cols-8 gap-1">
        {profile.buckets.map((bucket) => (
          <span
            key={bucket.minute}
            className="flex min-w-0 flex-col items-center"
          >
            <span className="flex h-7 items-end gap-px">
              <span
                aria-hidden="true"
                className="w-1 rounded-t-sm bg-(--wc-accent-border)"
                style={{
                  height: distributionBarHeight(
                    bucket.cardShare,
                    profile.maximumShare,
                    8,
                  ),
                  opacity: bucket.cardShare === 0 ? 0.18 : 1,
                }}
              />
              <span
                aria-hidden="true"
                className="w-1 rounded-t-sm bg-(--wc-text-50)"
                style={{
                  height: distributionBarHeight(
                    bucket.activityShare,
                    profile.maximumShare,
                    8,
                  ),
                  opacity: bucket.activityShare === 0 ? 0.18 : 0.7,
                }}
              />
            </span>
            <span
              aria-hidden="true"
              className="mt-1 text-[0.55rem] leading-none tabular-nums text-(--wc-text-60)"
            >
              {formatMinuteOfDay(bucket.minute).slice(0, 2)}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
