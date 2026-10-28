import type { Table } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { Pagination } from "../../../../components/pagination";
import type {
  DropRateLeague,
  LeagueDropRates,
} from "../../../../lib/dropRates";
import type { StackedDecksRow } from "../../hooks";
import {
  StackedDecksDataTable,
  StackedDecksTableFooter,
  StackedDecksTableFrame,
} from "../StackedDecksTable";
import { DataRow } from "./DataRow";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "./Skeleton";

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
  const { rows } = table.getRowModel();

  if (isLoading) return <Skeleton />;

  if (error) return <EmptyState>Failed to load drop rate data.</EmptyState>;

  if (!leagueData || !allRows?.length)
    return <EmptyState>No stacked deck data available.</EmptyState>;

  const filteredCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  function renderDataRow(
    row: (typeof rows)[number],
    index: number,
    shouldAnimate: boolean,
  ) {
    return (
      <DataRow
        key={row.id}
        row={row}
        animationIndex={index}
        shouldAnimate={shouldAnimate}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <StackedDecksTableFrame>
        {toggles}

        <StackedDecksDataTable
          table={table}
          scrollClassName="wc-stacked-decks-table-scroll"
          emptyState="No cards match your search."
          renderRow={renderDataRow}
        />

        <StackedDecksTableFooter>
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
        </StackedDecksTableFooter>
      </StackedDecksTableFrame>

      <Pagination
        page={pageIndex + 1}
        totalPages={pageCount}
        onChange={(p) => table.setPageIndex(p - 1)}
      />
    </div>
  );
}
