import { useMemo } from "react";
import { FiArrowRight } from "react-icons/fi";
import { ButtonInternalLink } from "../../../components/buttons/ButtonLink";
import { Heading } from "../../../components/headings";
import { Text } from "../../../components/text";
import { useStackedDecksData } from "../../stackedDecks/hooks/useStackedDecksData";
import { topObservedDropRates } from "../api/homepageStats";

export function StackedDecksPanel() {
  const { rows, isLoading, error } = useStackedDecksData();
  const topDropRates = useMemo(() => topObservedDropRates(rows), [rows]);
  const hasDropRates = topDropRates.length > 0;
  let emptyMessage = "No drop-rate observations are available yet.";

  if (isLoading) {
    emptyMessage = "Loading drop rates...";
  } else if (error) {
    emptyMessage = "Drop rates are unavailable.";
  }

  return (
    <div className="rounded-xl border border-(--wc-border) bg-base-300 p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Text
            size="xs"
            weight="semibold"
            uppercase
            className="tracking-wider text-info"
          >
            Stacked Decks
          </Text>
          <Heading as="h2" size="lg" className="text-(--wc-text-90)">
            Observed drop rates
          </Heading>
        </div>

        {hasDropRates && (
          <ul className="flex flex-col divide-y divide-(--wc-border)">
            {topDropRates.map((entry) => (
              <li
                key={entry.cardName}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="truncate text-sm text-(--wc-text-70)">
                  {entry.cardName}
                </span>
                <span className="shrink-0 text-sm font-semibold text-success">
                  {entry.rate}
                </span>
              </li>
            ))}
          </ul>
        )}

        {!hasDropRates && (
          <Text size="sm" className="py-6 text-(--wc-text-50)">
            {emptyMessage}
          </Text>
        )}

        <ButtonInternalLink
          gameScoped
          to="/stacked-decks"
          className="flex items-center justify-center gap-2 rounded-lg border border-(--wc-accent-border) bg-(--wc-glow) px-4 py-2 text-center text-sm font-medium text-(--wc-text-90) transition-colors hover:brightness-110"
        >
          View all drop rates
          <FiArrowRight aria-hidden="true" />
        </ButtonInternalLink>
      </div>
    </div>
  );
}
