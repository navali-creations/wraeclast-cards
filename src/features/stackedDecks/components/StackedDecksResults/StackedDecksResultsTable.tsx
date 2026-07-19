import type { Table } from "@tanstack/react-table";
import { type ReactNode, useEffect, useState } from "react";
import { Pagination } from "../../../../components/pagination";
import type {
  DropRateLeague,
  LeagueDropRates,
} from "../../../../lib/dropRates";
import type { StackedDecksRow } from "../../hooks";
import { DataRow } from "./DataRow";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";
import { SortableHeaderCell } from "./SortableHeaderCell";
import "./StackedDecksResultsTable.css";

interface StackedDecksResultsTableProps {
  table: Table<StackedDecksRow>;
  league: DropRateLeague | undefined;
  leagueData: LeagueDropRates | undefined;
  allRows: StackedDecksRow[] | undefined;
  totalCount: number;
  isLoading: boolean;
  error: unknown;
  toggles?: ReactNode;
}

export function StackedDecksResultsTable({
  table,
  league,
  leagueData,
  allRows,
  totalCount,
  isLoading,
  error,
  toggles,
}: StackedDecksResultsTableProps) {
  const [shouldAnimateRows, setShouldAnimateRows] = useState(true);
  const { rows } = table.getRowModel();

  useEffect(() => {
    if (
      !shouldAnimateRows ||
      isLoading ||
      error ||
      !leagueData ||
      !allRows?.length ||
      rows.length === 0
    ) {
      return;
    }

    const rowEnterDurationMs = 340;
    const rowStaggerMs = 32;
    const animationTimeout = window.setTimeout(
      () => setShouldAnimateRows(false),
      rowEnterDurationMs + (rows.length - 1) * rowStaggerMs,
    );

    return () => window.clearTimeout(animationTimeout);
  }, [
    allRows?.length,
    error,
    isLoading,
    leagueData,
    rows.length,
    shouldAnimateRows,
  ]);

  if (isLoading) return <Skeleton />;

  if (error) return <EmptyState>Failed to load drop rate data.</EmptyState>;

  if (!leagueData || !allRows?.length)
    return <EmptyState>No stacked deck data available.</EmptyState>;

  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const headers = table.getFlatHeaders();

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)">
        {toggles}

        <div className="wc-stacked-decks-table-scroll overflow-x-auto">
          <table className="w-full border-collapse text-sm text-(--wc-text-dimmed)">
            <thead>
              <tr className="bg-(--wc-glow) text-(--wc-text-80)">
                {headers.map((header) => (
                  <SortableHeaderCell key={header.id} header={header} />
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="py-12 text-center text-sm text-(--wc-text-50)"
                  >
                    No cards match your search.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <DataRow
                    key={row.id}
                    row={row}
                    animationIndex={idx}
                    shouldAnimate={shouldAnimateRows}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-(--wc-accent-border) bg-(--wc-glow) px-3 py-2 text-[11px] text-(--wc-text-70)">
          <span className="leading-none">
            {pageCount > 1 ? (
              <>
                Showing{" "}
                <span className="tabular-nums text-(--wc-gold-muted)">
                  {pageIndex * pageSize + 1}–
                  {Math.min((pageIndex + 1) * pageSize, filteredCount)}
                </span>
                {" of "}
                <span className="tabular-nums text-(--wc-gold-muted)">
                  {filteredCount.toLocaleString()}
                </span>
                {" cards"}
              </>
            ) : (
              <>
                <span className="tabular-nums text-(--wc-gold-muted)">
                  {filteredCount}
                </span>{" "}
                card{filteredCount !== 1 ? "s" : ""}
              </>
            )}
            {" · "}
            <span className="tabular-nums">
              {totalCount.toLocaleString()} observations
            </span>
          </span>
          <span className="leading-none rounded border border-(--wc-border-dimmed) px-1.5 py-0.5 text-(--wc-text-70)">
            {league?.name}
          </span>
        </div>
      </section>

      <Pagination
        page={pageIndex + 1}
        totalPages={pageCount}
        onChange={(p) => table.setPageIndex(p - 1)}
      />
    </div>
  );
}
