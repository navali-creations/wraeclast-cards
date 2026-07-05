import {
  type CellContext,
  createColumnHelper,
  type FilterFn,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { StackedDecksRow } from "../../../hooks";

export const columnHelper = createColumnHelper<StackedDecksRow>();

export type ColOptions<K extends keyof StackedDecksRow> = {
  align?: "left" | "right";
  thClassName?: string;
  tdClassName?: string;
  cell?: (ctx: CellContext<StackedDecksRow, StackedDecksRow[K]>) => ReactNode;
  filterFn?: FilterFn<StackedDecksRow>;
  sortDescFirst?: boolean;
};

export function col<K extends keyof StackedDecksRow>(
  key: K,
  header: string,
  options: ColOptions<K> = {},
) {
  const { align, thClassName, tdClassName, cell, filterFn, sortDescFirst } =
    options;
  return columnHelper.accessor(key, {
    header,
    ...(filterFn !== undefined && { filterFn }),
    ...(cell !== undefined && {
      cell: cell as (ctx: CellContext<StackedDecksRow, unknown>) => ReactNode,
    }),
    ...(sortDescFirst !== undefined && { sortDescFirst }),
    meta: { align, thClassName, tdClassName },
  });
}

/**
 * Like `col`, but switches between a raw and a verified field depending on
 * `verified`. The column id stays pinned to `rawKey` so sorting/visibility
 * state doesn't reset when the verified toggle flips.
 */
export function dualCol<
  RK extends keyof StackedDecksRow,
  VK extends keyof StackedDecksRow,
>(
  rawKey: RK,
  verifiedKey: VK,
  verified: boolean,
  header: string,
  options: ColOptions<RK> = {},
) {
  const { align, thClassName, tdClassName, cell, filterFn, sortDescFirst } =
    options;
  return columnHelper.accessor(
    (row) => (verified ? row[verifiedKey] : row[rawKey]),
    {
      id: rawKey,
      header,
      ...(filterFn !== undefined && { filterFn }),
      ...(cell !== undefined && {
        cell: cell as (ctx: CellContext<StackedDecksRow, unknown>) => ReactNode,
      }),
      ...(sortDescFirst !== undefined && { sortDescFirst }),
      meta: { align, thClassName, tdClassName },
    },
  );
}
