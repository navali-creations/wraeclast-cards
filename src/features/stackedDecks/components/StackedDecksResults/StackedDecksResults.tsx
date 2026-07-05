import { ColumnVisibilityToggles } from "../../../../components/columnVisibilityToggles";
import { SECONDARY_COLUMNS } from "./columns/toggles/secondaryColumns";
import { StackedDecksResultsTable } from "./StackedDecksResultsTable";
import { useStackedDecksTable } from "./useStackedDecksTable";

interface StackedDecksResultsProps {
  searchTerm: string;
  verified: boolean;
}

export function StackedDecksResults(props: StackedDecksResultsProps) {
  const { table, ...data } = useStackedDecksTable(props);

  return (
    <StackedDecksResultsTable
      table={table}
      {...data}
      toggles={
        <ColumnVisibilityToggles table={table} columns={SECONDARY_COLUMNS} />
      }
    />
  );
}
