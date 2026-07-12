import {
  type CellContext,
  createColumnHelper,
  type FilterFn,
  type HeaderContext,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { StackedDecksRow } from "../../../hooks";

export const columnHelper = createColumnHelper<StackedDecksRow>();

type ColumnHeaderContent<TValue> =
  | string
  | ((context: HeaderContext<StackedDecksRow, TValue>) => ReactNode);

export type ColOptions<K extends keyof StackedDecksRow> = {
  align?: "left" | "right";
  thClassName?: string;
  tdClassName?: string;
  cell?: (ctx: CellContext<StackedDecksRow, StackedDecksRow[K]>) => ReactNode;
  filterFn?: FilterFn<StackedDecksRow>;
  sortDescFirst?: boolean;
  sortUndefined?: "first" | "last" | false | -1 | 1;
};

function sortableValue<T>(
  value: T,
  sortUndefined: ColOptions<keyof StackedDecksRow>["sortUndefined"],
) {
  return sortUndefined !== undefined && value === null ? undefined : value;
}

export function col<K extends keyof StackedDecksRow>(
  key: K,
  header: ColumnHeaderContent<StackedDecksRow[K]>,
  options: ColOptions<K> = {},
) {
  const {
    align,
    thClassName,
    tdClassName,
    cell,
    filterFn,
    sortDescFirst,
    sortUndefined,
  } = options;
  return columnHelper.accessor(
    (row) => sortableValue(row[key], sortUndefined),
    {
      id: String(key),
      header,
      ...(filterFn !== undefined && { filterFn }),
      ...(cell !== undefined && {
        cell: cell as (ctx: CellContext<StackedDecksRow, unknown>) => ReactNode,
      }),
      ...(sortDescFirst !== undefined && { sortDescFirst }),
      ...(sortUndefined !== undefined && { sortUndefined }),
      meta: { align, thClassName, tdClassName },
    },
  );
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
  header: ColumnHeaderContent<StackedDecksRow[RK] | StackedDecksRow[VK]>,
  options: ColOptions<RK> = {},
) {
  const {
    align,
    thClassName,
    tdClassName,
    cell,
    filterFn,
    sortDescFirst,
    sortUndefined,
  } = options;
  return columnHelper.accessor(
    (row) =>
      sortableValue(verified ? row[verifiedKey] : row[rawKey], sortUndefined),
    {
      id: rawKey,
      header,
      ...(filterFn !== undefined && { filterFn }),
      ...(cell !== undefined && {
        cell: cell as (ctx: CellContext<StackedDecksRow, unknown>) => ReactNode,
      }),
      ...(sortDescFirst !== undefined && { sortDescFirst }),
      ...(sortUndefined !== undefined && { sortUndefined }),
      meta: { align, thClassName, tdClassName },
    },
  );
}
