import { type ChangeEvent, useEffect } from "react";
import { divinationCardSlug } from "../../../../../lib/divinationCards";
import { CardNamePreview } from "../../../components/StackedDecksResults/CardNamePreview/CardNamePreview";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import {
  formatComparisonMetricValue,
  formatMetricDifference,
  formatObservationCount,
  getComparisonMetric,
} from "../StackedDecksComparisonPage.utils";

export function HistoryView() {
  const {
    rows,
    historyCardName,
    setHistoryCardName,
    baselineLeague,
    metric,
    verified,
  } = useStackedDecksComparison();
  const metricDetails = getComparisonMetric(metric);
  const focusedRow =
    rows.find((row) => row.name === historyCardName) ?? rows[0];
  const maxValue = Math.max(
    ...(focusedRow?.values ?? [])
      .map((value) => value.value ?? 0)
      .filter((value) => value > 0),
    1e-9,
  );

  useEffect(() => {
    if (historyCardName && focusedRow && focusedRow.name !== historyCardName) {
      setHistoryCardName(focusedRow.name, true);
    }
  }, [focusedRow, historyCardName, setHistoryCardName]);

  function handleCardChange(event: ChangeEvent<HTMLSelectElement>) {
    setHistoryCardName(event.currentTarget.value);
  }

  if (!focusedRow) {
    return (
      <div className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-8 text-center text-(--wc-text-dimmed)">
        No cards match the current search.
      </div>
    );
  }

  return (
    <section aria-labelledby="history-heading">
      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(14rem,22rem)] sm:items-end">
        <div>
          <h2
            id="history-heading"
            className="font-crimson text-2xl font-semibold text-(--wc-card-name)"
          >
            Card history
          </h2>
          <p className="text-sm text-(--wc-text-dimmed)">
            League-by-league {metricDetails.label.toLocaleLowerCase("en-US")}.
            The visual is relative to this card’s highest selected value.
          </p>
        </div>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-(--wc-text-dimmed)">
          Focused card
          <select
            value={focusedRow.name}
            onChange={handleCardChange}
            className="select select-bordered h-10 min-h-10 w-full border-(--wc-border-dimmed) bg-(--wc-table-even) text-sm normal-case text-(--wc-card-name) focus:outline-none"
          >
            {rows.map((row) => (
              <option key={row.key} value={row.name}>
                {row.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-xl border border-(--wc-border-dimmed) bg-(--wc-table-odd)">
        <div className="border-b border-(--wc-border-dimmed) px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-fontin-sc text-xl text-(--wc-accent-border)">
              <CardNamePreview
                cardId={divinationCardSlug(focusedRow.name)}
                name={focusedRow.name}
              />
            </h3>
            <span className="text-xs text-(--wc-text-dimmed)">
              Baseline: {baselineLeague?.name ?? "None"}
            </span>
          </div>
        </div>

        <div className="space-y-1 p-3 sm:p-5">
          {focusedRow.values.map((value) => {
            const width =
              value.value === null
                ? 0
                : Math.max(2, (value.value / maxValue) * 100);

            return (
              <div
                key={value.leagueId}
                className="grid gap-2 rounded-lg px-2 py-3 hover:bg-(--wc-table-even) sm:grid-cols-[9rem_minmax(8rem,1fr)_7.5rem] sm:items-center sm:gap-4"
              >
                <div className="flex items-center justify-between gap-2 sm:block">
                  <p className="truncate text-sm font-semibold text-(--wc-card-name)">
                    {value.leagueName}
                  </p>
                  <p className="text-xs text-(--wc-text-dimmed)">
                    {formatObservationCount(value.count)}{" "}
                    {verified ? "verified " : ""}drops
                  </p>
                </div>

                <div className="h-7 overflow-hidden rounded bg-(--wc-bg-dimmed)">
                  <div
                    className="flex h-full min-w-0 items-center rounded bg-primary/80 px-2 text-[11px] font-semibold text-primary-content transition-[width]"
                    style={{ width: `${width}%` }}
                  >
                    {width >= 24 &&
                      formatComparisonMetricValue(metric, value.value)}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 sm:block sm:text-right">
                  <span className="text-sm font-semibold tabular-nums text-(--wc-card-name)">
                    {formatComparisonMetricValue(metric, value.value)}
                  </span>
                  <span className="text-xs tabular-nums text-(--wc-text-dimmed) sm:block">
                    {value.value !== null && !value.isEligible
                      ? "Below sample"
                      : value.isBaseline
                        ? "Baseline"
                        : formatMetricDifference(metric, value.difference)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
