import type { CellContext } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { CardImageCell, DropLocationsCell } from "./CardsTable.cells";

export type CardRow = {
  id: string;
  name: string;
  imageUrl?: string;
  flavourText?: string;
  rewardText: string;
  dropLocations: string[];
};

const col = createColumnHelper<CardRow>();

export type ColMeta = { className?: string };

const colMeta = (className: string): ColMeta => ({ className });

const textCell =
  (className: string, fallback?: string) =>
  (info: CellContext<CardRow, string | undefined>) => (
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
