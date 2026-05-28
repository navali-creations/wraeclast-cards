import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useState } from "react";
import type { Card } from "../types";

const col = createColumnHelper<Card>();

// Each column carries an optional className applied to both <th> and <td>
type ColMeta = { className?: string };

const columns = [
  col.display({
    id: "image",
    header: "",
    meta: { className: "hidden sm:table-cell w-12" } satisfies ColMeta,
    cell: (info) => {
      const imageUrl = info.row.original.imageUrl;
      if (!imageUrl) {
        return (
          <div className="h-12 w-8 rounded-sm bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-400 text-[10px]">
            ?
          </div>
        );
      }

      return (
        <img
          src={imageUrl}
          alt={info.row.original.name}
          loading="lazy"
          className="h-14 w-9 rounded-sm border border-[#8e7d5f]/70 object-cover shadow-[0_2px_6px_-4px_black]"
        />
      );
    },
  }),
  col.accessor("name", {
    header: "Name",
    enableSorting: true,
    meta: { className: "w-40" } satisfies ColMeta,
    cell: (info) => (
      <span className="font-medium text-stone-800">{info.getValue()}</span>
    ),
  }),
  col.accessor("flavourText", {
    header: "Card text",
    enableSorting: false,
    meta: { className: "hidden md:table-cell max-w-xs" } satisfies ColMeta,
    cell: (info) => (
      <span className="line-clamp-2 text-xs italic text-stone-500">
        {info.getValue() ?? "—"}
      </span>
    ),
  }),
  col.accessor("rewardText", {
    header: "Reward",
    enableSorting: true,
    meta: { className: "w-32" } satisfies ColMeta,
    cell: (info) => <span className="text-stone-700">{info.getValue()}</span>,
  }),
  col.accessor("dropLocations", {
    header: "Drop locations",
    enableSorting: false,
    meta: { className: "hidden lg:table-cell" } satisfies ColMeta,
    cell: (info) => {
      const locs = info.getValue();
      if (!locs.length) return <span className="text-stone-400">—</span>;
      const shown = locs.slice(0, 2).join(", ");
      const extra = locs.length > 2 ? locs.length - 2 : null;
      return (
        <span className="text-xs text-stone-500 flex items-center gap-1.5">
          {shown}
          {extra && (
            <span className="rounded bg-stone-200 px-1 py-0.5 text-[10px] font-medium text-stone-500">
              +{extra}
            </span>
          )}
        </span>
      );
    },
  }),
];

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
  const [internalSorting, setInternalSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const sorting = controlledSorting ?? internalSorting;

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    if (controlledSorting !== undefined) {
      onSortingChange?.(next);
    } else {
      setInternalSorting(next);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-stone-300">
        <p className="text-sm text-stone-500">Failed to load cards.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no identity
          <div key={i} className="h-12 rounded bg-[#c6b79e]/45" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-stone-300">
        <p className="text-sm text-stone-400">No cards match your search.</p>
      </div>
    );
  }

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div className="overflow-x-auto rounded-lg border border-[#b7a587] bg-[linear-gradient(180deg,rgba(244,236,220,0.78),rgba(236,225,204,0.88))] shadow-[0_14px_24px_-22px_black]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#b9a888] bg-[linear-gradient(180deg,#f2e7d2,#e6d7bc)]">
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta as ColMeta | undefined;
              return (
                <th
                  key={header.id}
                  className={clsx(
                    "px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#7c6545]",
                    header.column.getCanSort() &&
                      "cursor-pointer select-none group/th hover:text-[#59442a]",
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
                      <span
                        className={clsx(
                          "transition-opacity",
                          header.column.getIsSorted()
                            ? "text-[#6f5638] opacity-100"
                            : "opacity-0 group-hover/th:opacity-40",
                        )}
                      >
                        {header.column.getIsSorted() === "asc"
                          ? "↑"
                          : header.column.getIsSorted() === "desc"
                            ? "↓"
                            : "↕"}
                      </span>
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
                "border-b border-[#cbbda2] transition-colors last:border-0 hover:bg-[#f3e7d1]/75",
                i % 2 !== 0 && "bg-[#f5ebd9]/38",
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as ColMeta | undefined;
                return (
                  <td
                    key={cell.id}
                    className={clsx("px-3 py-2.5", meta?.className)}
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
