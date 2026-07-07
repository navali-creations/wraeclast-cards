import { flexRender, type Header } from "@tanstack/react-table";
import { clsx } from "clsx";
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from "react-icons/hi2";
import type { StackedDecksRow } from "../../hooks";

interface SortableHeaderCellProps {
  header: Header<StackedDecksRow, unknown>;
}

export function SortableHeaderCell({ header }: SortableHeaderCellProps) {
  const { column } = header;
  const meta = column.columnDef.meta;
  const isSorted = column.getIsSorted();
  const canSort = column.getCanSort();
  const alignRight = meta?.align === "right";
  return (
    <th
      onClick={column.getToggleSortingHandler()}
      className={clsx(
        "px-3 py-3 text-xs font-semibold transition-colors",
        canSort && "cursor-pointer select-none",
        alignRight ? "text-right" : "text-left",
        meta?.thClassName,
        isSorted ? "text-(--wc-hero-accent)" : "text-(--wc-text-70)",
        !isSorted && canSort && "hover:text-(--wc-gold)",
      )}
    >
      <span
        className={clsx(
          "inline-flex items-center gap-1",
          alignRight && "flex-row-reverse",
        )}
      >
        {flexRender(column.columnDef.header, header.getContext())}
        {isSorted === "desc" ? (
          <HiChevronDown className="size-3.5" />
        ) : isSorted === "asc" ? (
          <HiChevronUp className="size-3.5" />
        ) : canSort ? (
          <HiChevronUpDown className="size-3.5 opacity-40" />
        ) : null}
      </span>
    </th>
  );
}
