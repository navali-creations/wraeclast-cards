import { flexRender, type Row } from "@tanstack/react-table";
import { clsx } from "clsx";
import type { StackedDecksRow } from "../../hooks";

interface DataRowProps {
  row: Row<StackedDecksRow>;
}

export function DataRow({ row }: DataRowProps) {
  return (
    <tr className="border-t border-(--wc-border-dimmed) transition-colors odd:bg-(--wc-table-even) even:bg-(--wc-table-odd) hover:bg-(--wc-bg-dimmed)">
      {row.getVisibleCells().map((cell) => {
        const meta = cell.column.columnDef.meta;
        const isSorted = cell.column.getIsSorted();
        return (
          <td
            key={cell.id}
            className={clsx(
              "px-3 py-3",
              meta?.align === "right" && "text-right",
              meta?.tdClassName,
              isSorted && "xs:bg-(--wc-skeleton-highlight)",
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
