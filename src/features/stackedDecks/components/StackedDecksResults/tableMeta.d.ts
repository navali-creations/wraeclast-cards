import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    maxWeight: number;
    pageOffset: number;
  }
}
