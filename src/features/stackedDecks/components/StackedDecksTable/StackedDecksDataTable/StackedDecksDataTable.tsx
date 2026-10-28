import type { Row, Table } from "@tanstack/react-table";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { StackedDecksTableHead } from "../StackedDecksTableHead/StackedDecksTableHead";
import { StackedDecksTableRow } from "../StackedDecksTableRow/StackedDecksTableRow";
import "./StackedDecksDataTable.css";

interface StackedDecksDataTableProps<TData> {
  table: Table<TData>;
  ariaLabel?: string;
  className?: string;
  scrollClassName?: string;
  headClassName?: string;
  emptyState?: ReactNode;
  renderRow?: (
    row: Row<TData>,
    index: number,
    shouldAnimate: boolean,
  ) => ReactNode;
}

export function StackedDecksDataTable<TData>({
  table,
  ariaLabel,
  className,
  scrollClassName,
  headClassName,
  emptyState,
  renderRow,
}: StackedDecksDataTableProps<TData>) {
  const [shouldAnimateRows, setShouldAnimateRows] = useState(true);
  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  useEffect(() => {
    if (!shouldAnimateRows || rows.length === 0) return;

    const rowEnterDurationMs = 340;
    const rowStaggerMs = 32;
    const animationTimeout = window.setTimeout(
      () => setShouldAnimateRows(false),
      rowEnterDurationMs + (rows.length - 1) * rowStaggerMs,
    );

    return () => window.clearTimeout(animationTimeout);
  }, [rows.length, shouldAnimateRows]);

  return (
    <div className={clsx("overflow-x-auto", scrollClassName)}>
      <table
        aria-label={ariaLabel}
        className={clsx(
          "w-full border-collapse text-sm text-(--wc-text-dimmed)",
          className,
        )}
      >
        <StackedDecksTableHead table={table} className={headClassName} />
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className="py-12 text-center text-sm text-(--wc-text-50)"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, index) =>
              renderRow ? (
                renderRow(row, index, shouldAnimateRows)
              ) : (
                <StackedDecksTableRow
                  key={row.id}
                  row={row}
                  className={clsx(
                    shouldAnimateRows && "wc-stacked-decks-row-enter",
                  )}
                  style={{ "--row-stagger": index } as CSSProperties}
                />
              ),
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
