import { flexRender, type Row } from "@tanstack/react-table";
import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

interface StackedDecksTableRowProps<TData>
  extends Omit<ComponentPropsWithoutRef<"tr">, "children"> {
  row: Row<TData>;
}

export function StackedDecksTableRow<TData>({
  row,
  className,
  ...props
}: StackedDecksTableRowProps<TData>) {
  return (
    <tr
      className={clsx(
        "group border-t border-(--wc-border-dimmed) transition-colors odd:bg-(--wc-table-even) even:bg-(--wc-table-odd) hover:bg-(--wc-bg-dimmed)",
        className,
      )}
      {...props}
    >
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;

        return (
          <td
            key={cell.id}
            className={clsx(
              "px-3 py-3",
              meta?.align === "right" && "text-right",
              meta?.tdClassName,
              cell.column.getIsSorted() && "xs:bg-(--wc-skeleton-highlight)",
            )}
          >
            <div className="wc-stacked-decks-cell-content">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </td>
        );
      })}
    </tr>
  );
}
