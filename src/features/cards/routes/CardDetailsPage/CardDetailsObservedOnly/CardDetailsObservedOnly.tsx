import { Text } from "../../../../../components/text";
import type { DropRateCard } from "../../../../../lib/dropRates";

const PERCENT_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
  style: "percent",
});

interface CardDetailsObservedOnlyProps {
  card: DropRateCard;
  leagueName: string;
}

export function CardDetailsObservedOnly({
  card,
  leagueName,
}: CardDetailsObservedOnlyProps) {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-5 sm:p-6">
      <Text as="h2" className="font-fontin text-xl text-(--wc-gold)">
        {leagueName} observations
      </Text>
      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs text-(--wc-text-50)">Reported drops</dt>
          <dd className="mt-1 tabular-nums text-(--wc-text-80)">
            {card.count.toLocaleString("en-US")}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-(--wc-text-50)">Observed rate</dt>
          <dd className="mt-1 tabular-nums text-(--wc-text-80)">
            {PERCENT_FORMATTER.format(card.ratio)}
          </dd>
        </div>
      </dl>
      <Text size="sm" className="mt-5 text-(--wc-text-60)">
        Historical reward and stack details are unavailable for this league.
      </Text>
    </section>
  );
}
