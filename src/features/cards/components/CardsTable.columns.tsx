import type { CellContext } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { Card } from "../types";
import { CardImageCell, DropLocationsCell } from "./CardsTable.cells";

const col = createColumnHelper<Card>();

export type ColMeta = { className?: string };

const colMeta = (className: string): ColMeta => ({ className });

const textCell =
  (className: string, fallback?: string) =>
  (info: CellContext<Card, string | undefined>) => (
    <span className={className}>{info.getValue() ?? fallback}</span>
  );

export const columns = [
  col.display({
    id: "image",
    header: "",
    meta: colMeta("hidden sm:table-cell w-36"),
    cell: ({ row }) => (
      <CardImageCell
        imageUrl={row.original.imageUrl}
        name={row.original.name}
      />
    ),
  }),
  col.accessor("name", {
    header: "Name",
    enableSorting: true,
    meta: colMeta("w-40"),
    cell: textCell("font-medium text-(--wc-text-30)"),
  }),
  col.accessor("flavourText", {
    header: "Card text",
    enableSorting: false,
    meta: colMeta("hidden md:table-cell max-w-xs"),
    cell: textCell("line-clamp-2 text-xs italic text-(--wc-text-40)", "—"),
  }),
  col.accessor("rewardText", {
    header: "Reward",
    enableSorting: true,
    meta: colMeta("w-32"),
    cell: textCell("text-(--wc-text-30)"),
  }),
  col.accessor("dropLocations", {
    header: "Drop locations",
    enableSorting: false,
    meta: colMeta("hidden lg:table-cell"),
    cell: ({ getValue }) => <DropLocationsCell locations={getValue()} />,
  }),
];
