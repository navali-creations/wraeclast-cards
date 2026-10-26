import { Outlet } from "@tanstack/react-router";
import { PageContent } from "../../../../../components/page-content/PageContent/PageContent";
import { PageHeader } from "../../../../../components/page-header/PageHeader/PageHeader";
import { ComparisonControls } from "../ComparisonControls/ComparisonControls";
import { ComparisonHeaderActions } from "../ComparisonHeaderActions/ComparisonHeaderActions";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import { formatComparisonSubtitle } from "../StackedDecksComparisonPage.utils";

export function StackedDecksComparisonWorkspace() {
  const {
    view,
    leagues,
    selectedLeagues,
    moverTransition,
    observationCountByLeagueId,
    isLoading,
    hasComparableData,
    loadingLeagueCount,
    failedLeagueNames,
    retryFailedLeagues,
  } = useStackedDecksComparison();
  const subtitleLeagues = (
    view === "movers" && moverTransition
      ? [moverTransition.fromLeague, moverTransition.toLeague]
      : selectedLeagues
  ).filter((league) => observationCountByLeagueId.has(league.id));
  const subtitle = formatComparisonSubtitle(
    subtitleLeagues,
    observationCountByLeagueId,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Compare Stacked Decks"
        reserveSubtitleSpace
        subtitle={subtitle}
        actions={<ComparisonHeaderActions />}
      />

      <PageContent>
        <div className="mx-auto flex min-h-0 w-full max-w-300 flex-1 flex-col gap-6 px-4 py-6">
          <ComparisonControls />

          {isLoading && (
            <div
              role="status"
              className="rounded-lg border border-info/25 bg-info/10 px-3 py-2 text-sm text-(--wc-text-dimmed)"
            >
              Loading {loadingLeagueCount} more league{" "}
              {loadingLeagueCount === 1 ? "dataset" : "datasets"}… The
              comparison appears as soon as two are ready.
            </div>
          )}

          {failedLeagueNames.length > 0 && hasComparableData && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-(--wc-text-dimmed)"
            >
              <span>
                Could not load: {failedLeagueNames.join(", ")}. Other league
                values remain available.
              </span>
              <button
                type="button"
                onClick={retryFailedLeagues}
                className="btn btn-xs btn-ghost text-(--wc-gold-muted)"
              >
                Retry
              </button>
            </div>
          )}

          {leagues.length === 0 ? (
            <div className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-8 text-center text-(--wc-text-dimmed)">
              No stacked-deck league archives are available for this game yet.
            </div>
          ) : (
            <>
              {selectedLeagues.length < 2 && (
                <div
                  role="alert"
                  className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-(--wc-text-dimmed)"
                >
                  Select at least two leagues to calculate movement.
                </div>
              )}

              {!hasComparableData && isLoading ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="wc-card-shimmer h-28 rounded-xl border border-(--wc-border-dimmed) bg-(--wc-skeleton)"
                    />
                  ))}
                </div>
              ) : !hasComparableData ? (
                <div
                  role="alert"
                  className="rounded-xl border border-warning/40 bg-warning/10 p-6 text-center text-(--wc-text-dimmed)"
                >
                  <p className="font-semibold text-(--wc-card-name)">
                    At least two league datasets are required for comparison.
                  </p>
                  {failedLeagueNames.length > 0 && (
                    <p className="mt-1 text-sm">
                      Could not load: {failedLeagueNames.join(", ")}.
                    </p>
                  )}
                  {failedLeagueNames.length > 0 && (
                    <button
                      type="button"
                      onClick={retryFailedLeagues}
                      className="btn btn-sm btn-outline mt-4 border-(--wc-accent-border) text-(--wc-gold-muted) hover:bg-(--wc-glow)"
                    >
                      Retry failed datasets
                    </button>
                  )}
                </div>
              ) : (
                <Outlet />
              )}
            </>
          )}
        </div>
      </PageContent>
    </div>
  );
}
