import type { Table } from "@tanstack/react-table";
import { clsx } from "clsx";
import { StackedDecksTableHeaderCell } from "../StackedDecksTableHeaderCell/StackedDecksTableHeaderCell";

interface StackedDecksTableHeadProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function StackedDecksTableHead<TData>({
  table,
  className,
}: StackedDecksTableHeadProps<TData>) {
  return (
    <thead className={className}>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className={clsx("bg-(--wc-glow) text-(--wc-text-80)")}
        >
          {headerGroup.headers.map((header) => (
            <StackedDecksTableHeaderCell key={header.id} header={header} />
          ))}
        </tr>
      ))}
    </thead>
  );
}
