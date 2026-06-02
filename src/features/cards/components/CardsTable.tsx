import type { SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useTableSorting } from "../hooks/useTableSorting";
import type { Card } from "../types";
import { type ColMeta, columns } from "./CardsTable.columns";

const SKELETON_ROW_IDS = Array.from(
  { length: 8 },
  (_, i) => `cards-table-skeleton-${i + 1}`,
);

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-(--wc-border)">
      <p className="text-sm text-(--wc-text-50)">{children}</p>
    </div>
  );
}

function SortIndicator({ direction }: { direction: "asc" | "desc" | false }) {
  return (
    <span
      className={clsx(
        "transition-opacity",
        direction
          ? "text-(--wc-text-40) opacity-100"
          : "opacity-0 group-hover/th:opacity-40",
      )}
    >
      {direction === "asc" ? "↑" : direction === "desc" ? "↓" : "↕"}
    </span>
  );
}

interface CardsTableProps {
  data: Card[];
  isLoading?: boolean;
  error?: Error | null;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
}

export function CardsTable({
  data,
  isLoading,
  error,
  sorting: controlledSorting,
  onSortingChange,
}: CardsTableProps) {
  const [sorting, handleSortingChange] = useTableSorting(
    controlledSorting,
    onSortingChange,
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error) {
    return <EmptyMessage>Failed to load cards.</EmptyMessage>;
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {SKELETON_ROW_IDS.map((id) => (
          <div
            key={id}
            className="h-14 rounded-lg bg-[color-mix(in_oklch,var(--wc-gold-bright)_36%,white)]"
          />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return <EmptyMessage>No cards match your search.</EmptyMessage>;
  }

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div className="overflow-x-auto rounded-lg bg-[color-mix(in_oklch,var(--wc-gold-bright)_44%,white)] shadow-[0_8px_16px_-8px_black]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--wc-gold) bg-(--wc-gold-muted)">
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta as ColMeta | undefined;
              return (
                <th
                  key={header.id}
                  className={clsx(
                    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-(--wc-text-30)",
                    header.column.getCanSort() &&
                      "group/th cursor-pointer select-none transition-colors hover:opacity-70",
                    meta?.className,
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <span className="flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getCanSort() && (
                      <SortIndicator direction={header.column.getIsSorted()} />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={clsx(
                "border-b border-[color-mix(in_oklch,var(--wc-gold-dim)_35%,white)] transition-colors last:border-0",
                "hover:bg-(--wc-gold-bright)",
                i % 2 !== 0 &&
                  "bg-[color-mix(in_oklch,var(--wc-gold-bright)_20%,white)]",
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as ColMeta | undefined;
                return (
                  <td
                    key={cell.id}
                    className={clsx("px-4 py-3 align-middle", meta?.className)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
