import { type ChangeEvent, useEffect, useMemo } from "react";
import { Pagination } from "../../../../../components/pagination";
import { divinationCardSlug } from "../../../../../lib/divinationCards";
import { CardNamePreview } from "../../../components/StackedDecksResults/CardNamePreview/CardNamePreview";
import { DeltaPercentCell } from "../../../components/StackedDecksResults/columns/cells/DeltaPercentCell";
import { useStackedDecksComparison } from "../StackedDecksComparisonContext/StackedDecksComparisonContext";
import {
  formatComparisonMetricValue,
  formatMetricDifference,
  formatObservationCount,
  getComparisonMetric,
} from "../StackedDecksComparisonPage.utils";
import { useComparisonDesktopLayout } from "../useComparisonDesktopLayout/useComparisonDesktopLayout";
import { MatrixTable } from "./MatrixTable/MatrixTable";
import { type ComparisonSort, sortComparisonRows } from "./MatrixView.utils";

export function MatrixView() {
  const {
    selectedLeagues,
    rows,
    metric,
    verified,
    sortBy,
    sortAscending,
    page,
    setPage,
    setTableSort,
  } = useStackedDecksComparison();
  const isDesktopLayout = useComparisonDesktopLayout();
  const orderedLeagues = selectedLeagues;
  const metricDetails = getComparisonMetric(metric);
  const canUseUrlSort =
    sortBy === "card" || orderedLeagues.some((league) => league.id === sortBy);
  const sort = useMemo<ComparisonSort>(
    () =>
      sortBy && canUseUrlSort
        ? {
            column: sortBy,
            direction: sortAscending ? "ascending" : "descending",
          }
        : { column: "card", direction: "ascending" },
    [canUseUrlSort, sortAscending, sortBy],
  );
  const sortedRows = useMemo(
    () => sortComparisonRows(rows, sort),
    [rows, sort],
  );
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const firstRowIndex = (currentPage - 1) * pageSize;
  const pageRows = sortedRows.slice(firstRowIndex, firstRowIndex + pageSize);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage, true);
  }, [currentPage, page, setPage]);

  function handlePageChange(pageNumber: number) {
    setPage(pageNumber);
  }

  function handleMobileSortColumnChange(event: ChangeEvent<HTMLSelectElement>) {
    const column = event.currentTarget.value;
    const ascending = column === "card";
    setTableSort(column === "card" ? undefined : column, ascending);
  }

  function handleMobileSortDirectionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const ascending = event.currentTarget.value === "ascending";
    const isDefaultSort = sort.column === "card" && ascending;
    setTableSort(
      isDefaultSort ? undefined : sort.column,
      isDefaultSort ? undefined : ascending,
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed) p-8 text-center text-(--wc-text-dimmed)">
        No cards match the current search.
      </div>
    );
  }

  return (
    <section aria-labelledby="matrix-heading">
      <div className="mb-3">
        <h2
          id="matrix-heading"
          className="font-crimson text-2xl font-semibold text-(--wc-card-name)"
        >
          League matrix
        </h2>
        <p className="text-sm text-(--wc-text-dimmed)">
          {metricDetails.label} by league, newest to oldest. Baseline badges
          identify the reference league.
        </p>
      </div>

      {isDesktopLayout ? (
        <MatrixTable
          rows={pageRows}
          leagues={orderedLeagues}
          sort={sort}
          firstRow={firstRowIndex + 1}
          totalRows={sortedRows.length}
        />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-(--wc-border-dimmed) bg-(--wc-table-even) p-3">
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-(--wc-text-dimmed)">
              Sort by
              <select
                value={sort.column}
                onChange={handleMobileSortColumnChange}
                className="select select-bordered h-10 min-h-10 w-full border-(--wc-border-dimmed) bg-(--wc-card-darker) text-sm normal-case text-(--wc-card-name) focus:outline-none"
              >
                <option value="card">Card</option>
                {orderedLeagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-(--wc-text-dimmed)">
              Direction
              <select
                value={sort.direction}
                onChange={handleMobileSortDirectionChange}
                className="select select-bordered h-10 min-h-10 w-full border-(--wc-border-dimmed) bg-(--wc-card-darker) text-sm normal-case text-(--wc-card-name) focus:outline-none"
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </label>
          </div>

          {pageRows.map((row) => (
            <details
              key={row.key}
              className="group overflow-hidden rounded-lg border border-(--wc-border-dimmed) bg-(--wc-table-odd)"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 marker:hidden">
                <div className="min-w-0">
                  <p className="truncate font-fontin-sc text-(--wc-accent-border)">
                    <CardNamePreview
                      cardId={divinationCardSlug(row.name)}
                      name={row.name}
                    />
                  </p>
                  <p className="mt-0.5 text-xs text-(--wc-text-dimmed)">
                    Baseline{" "}
                    {formatComparisonMetricValue(
                      metric,
                      row.baselineValue?.value ?? null,
                    )}
                  </p>
                </div>
                <DeltaPercentCell
                  value={row.strongestValue?.relativeDelta}
                  neutralLabel="No change"
                />
              </summary>
              <div className="border-t border-(--wc-border-dimmed) bg-(--wc-table-even)/70 px-3 py-2">
                {orderedLeagues.map((league) => {
                  const value = row.values.find(
                    (item) => item.leagueId === league.id,
                  );
                  const title = `${formatMetricDifference(metric, value?.difference ?? null)} · ${formatObservationCount(value?.count ?? null)} ${verified ? "verified " : ""}drops`;

                  return (
                    <div
                      key={league.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-(--wc-border-dimmed)/60 py-2 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-(--wc-card-name)">
                          {league.name}
                        </p>
                        <p className="text-xs text-(--wc-text-dimmed)">
                          {formatObservationCount(value?.count ?? null)}{" "}
                          {verified ? "verified " : ""}drops
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold tabular-nums text-(--wc-card-name)">
                          {formatComparisonMetricValue(
                            metric,
                            value?.value ?? null,
                          )}
                        </span>
                        {value?.value != null && !value.isEligible ? (
                          <span className="inline-flex min-w-20 justify-center rounded-sm bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning ring-1 ring-warning/30">
                            Below sample
                          </span>
                        ) : value?.isBaseline ? (
                          <span className="inline-flex min-w-20 justify-center rounded-sm bg-(--wc-bg-dimmed) px-2 py-0.5 text-xs font-semibold text-(--wc-text-50) ring-1 ring-(--wc-border-dimmed)">
                            Baseline
                          </span>
                        ) : (
                          <span title={title}>
                            <DeltaPercentCell value={value?.relativeDelta} />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Pagination
          page={currentPage}
          totalPages={pageCount}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
}
