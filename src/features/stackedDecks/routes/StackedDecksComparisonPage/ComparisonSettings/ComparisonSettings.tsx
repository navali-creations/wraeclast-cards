import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import {
  COMPARISON_METRICS,
  type ComparisonMetric,
} from "../StackedDecksComparisonPage.utils";

const SELECT_CLASS_NAME =
  "select select-bordered h-10 min-h-10 w-full border-(--wc-accent-border) bg-(--wc-card-darker) text-sm text-(--wc-text-80) focus:border-primary focus:outline-none";

export function ComparisonSettings() {
  const {
    leagues,
    selectedLeagues,
    selectedLeagueIds,
    baselineLeagueId,
    moverTransitions,
    moverTransition,
    view,
    metric,
    minimumObservations,
    setMetric,
    setBaselineLeagueId,
    setMoverTransitionId,
    setMinimumObservations,
    toggleLeague,
    selectAllLeagues,
  } = useStackedDecksComparison();

  function handleBaselineChange(event: ChangeEvent<HTMLSelectElement>) {
    setBaselineLeagueId(event.currentTarget.value);
  }

  function handleMetricChange(event: ChangeEvent<HTMLSelectElement>) {
    setMetric(event.currentTarget.value as ComparisonMetric);
  }

  function handleMoverFromLeagueChange(event: ChangeEvent<HTMLSelectElement>) {
    const transition = moverTransitions.find(
      (option) =>
        option.fromLeague.id === event.currentTarget.value &&
        option.toLeague.id === moverTransition?.toLeague.id,
    );

    if (transition) setMoverTransitionId(transition.id);
  }

  function handleMoverToLeagueChange(event: ChangeEvent<HTMLSelectElement>) {
    const transition = moverTransitions.find(
      (option) =>
        option.fromLeague.id === moverTransition?.fromLeague.id &&
        option.toLeague.id === event.currentTarget.value,
    );

    if (transition) setMoverTransitionId(transition.id);
  }

  function handleMinimumObservationsChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setMinimumObservations(Number(event.currentTarget.value));
  }

  return (
    <div
      className={clsx("grid gap-3 sm:grid-cols-2 lg:items-end", {
        "lg:grid-cols-[minmax(8rem,0.8fr)_minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(9rem,0.8fr)]":
          view === "movers",
        "lg:grid-cols-[minmax(9rem,0.8fr)_minmax(11rem,1fr)_minmax(10rem,0.8fr)]":
          view !== "movers",
      })}
    >
      <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--wc-text-50)">
        Metric
        <select
          value={metric}
          onChange={handleMetricChange}
          className={SELECT_CLASS_NAME}
        >
          {COMPARISON_METRICS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {view === "movers" ? (
        <>
          <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--wc-text-50)">
            From league
            <select
              value={moverTransition?.fromLeague.id ?? ""}
              onChange={handleMoverFromLeagueChange}
              disabled={moverTransitions.length === 0}
              className={SELECT_CLASS_NAME}
            >
              {moverTransitions.length === 0 && (
                <option value="">Not enough leagues</option>
              )}
              {selectedLeagues.map((league) => (
                <option
                  key={league.id}
                  value={league.id}
                  disabled={league.id === moverTransition?.toLeague.id}
                >
                  {league.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--wc-text-50)">
            To league
            <select
              value={moverTransition?.toLeague.id ?? ""}
              onChange={handleMoverToLeagueChange}
              disabled={moverTransitions.length === 0}
              className={SELECT_CLASS_NAME}
            >
              {moverTransitions.length === 0 && (
                <option value="">Not enough leagues</option>
              )}
              {selectedLeagues.map((league) => (
                <option
                  key={league.id}
                  value={league.id}
                  disabled={league.id === moverTransition?.fromLeague.id}
                >
                  {league.name}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : (
        <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--wc-text-50)">
          Baseline
          <select
            value={baselineLeagueId}
            onChange={handleBaselineChange}
            className={SELECT_CLASS_NAME}
          >
            {selectedLeagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wide text-(--wc-text-50)">
        Min. drops for change
        <select
          value={minimumObservations}
          onChange={handleMinimumObservationsChange}
          className={SELECT_CLASS_NAME}
        >
          <option value={0}>Any sample</option>
          <option value={10}>10+</option>
          <option value={100}>100+</option>
          <option value={1000}>1,000+</option>
        </select>
      </label>

      <fieldset
        className={clsx(
          "sm:col-span-2",
          view === "movers" ? "lg:col-span-4" : "lg:col-span-3",
        )}
      >
        <legend className="float-left mb-2 text-xs font-semibold uppercase tracking-wide text-(--wc-text-50)">
          Leagues
        </legend>
        <div className="mb-2 flex min-h-4 items-center justify-end gap-3">
          {selectedLeagueIds.length < leagues.length && (
            <button
              type="button"
              onClick={selectAllLeagues}
              className="text-xs font-semibold text-(--wc-gold-muted) underline-offset-4 hover:text-(--wc-gold-bright) hover:underline"
            >
              Select all
            </button>
          )}
        </div>

        <div className="clear-both grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {leagues.map((league) => {
            const checked = selectedLeagueIds.includes(league.id);
            const cannotRemove = checked && selectedLeagueIds.length <= 2;

            return (
              <label
                key={league.id}
                className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-(--wc-border) bg-(--wc-glow)/20 px-3 py-2 text-sm text-(--wc-text-70) has-checked:border-(--wc-accent-border) has-checked:bg-(--wc-glow)/55 has-checked:text-(--wc-text-90) has-disabled:cursor-not-allowed has-disabled:opacity-60"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm border-(--wc-text-40) checked:border-primary checked:bg-primary"
                  checked={checked}
                  disabled={cannotRemove}
                  onChange={() => toggleLeague(league.id)}
                />
                <span className="min-w-0 truncate">{league.name}</span>
                {!league.historical && (
                  <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                    Current
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
