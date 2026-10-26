import { flexRender, type Header } from "@tanstack/react-table";
import { clsx } from "clsx";
import type { KeyboardEvent } from "react";
import { HiChevronDown, HiChevronUp, HiChevronUpDown } from "react-icons/hi2";

interface StackedDecksTableHeaderCellProps<TData> {
  header: Header<TData, unknown>;
}

export function StackedDecksTableHeaderCell<TData>({
  header,
}: StackedDecksTableHeaderCellProps<TData>) {
  const { column } = header;
  const meta = column.columnDef.meta;
  const sortDirection = column.getIsSorted();
  const canSort = column.getCanSort();
  const alignRight = meta?.align === "right";
  const sortIconOnRight = column.id === "name" || column.id === "card";
  const content = flexRender(column.columnDef.header, header.getContext());

  function handleKeyDown(event: KeyboardEvent<HTMLTableCellElement>) {
    if (
      !canSort ||
      event.target !== event.currentTarget ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }

    event.preventDefault();
    column.toggleSorting();
  }

  return (
    <th
      aria-sort={
        sortDirection === "asc"
          ? "ascending"
          : sortDirection === "desc"
            ? "descending"
            : undefined
      }
      tabIndex={canSort ? 0 : undefined}
      onClick={canSort ? column.getToggleSortingHandler() : undefined}
      onKeyDown={handleKeyDown}
      className={clsx(
        "border-b border-(--wc-accent-border) px-3 py-3 text-xs font-semibold transition-colors",
        canSort &&
          "cursor-pointer select-none hover:text-(--wc-gold) focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--wc-gold)",
        alignRight ? "text-right" : "text-left",
        meta?.thClassName,
        sortDirection ? "text-(--wc-gold-bright)" : "text-(--wc-text-80)",
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {sortDirection === "desc" ? (
          <HiChevronDown
            aria-hidden="true"
            className={clsx("size-4 shrink-0 text-(--wc-gold-bright)", {
              "order-last": sortIconOnRight,
            })}
          />
        ) : sortDirection === "asc" ? (
          <HiChevronUp
            aria-hidden="true"
            className={clsx("size-4 shrink-0 text-(--wc-gold-bright)", {
              "order-last": sortIconOnRight,
            })}
          />
        ) : canSort ? (
          <HiChevronUpDown
            aria-hidden="true"
            className={clsx(
              "size-4 shrink-0 text-(--wc-gold-muted) opacity-75",
              { "order-last": sortIconOnRight },
            )}
          />
        ) : null}
        {content}
      </span>
    </th>
  );
}
