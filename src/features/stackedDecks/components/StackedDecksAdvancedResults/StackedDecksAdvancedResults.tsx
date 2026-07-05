import { ColumnVisibilityToggles } from "../../../../components/columnVisibilityToggles";
import { StackedDecksResultsTable } from "../StackedDecksResults/StackedDecksResultsTable";
import { ADVANCED_SECONDARY_COLUMNS } from "./secondaryColumns";
import { useAdvancedStackedDecksTable } from "./useAdvancedStackedDecksTable";

interface StackedDecksAdvancedResultsProps {
  searchTerm: string;
  verified: boolean;
}

export function StackedDecksAdvancedResults(
  props: StackedDecksAdvancedResultsProps,
) {
  const { table, ...data } = useAdvancedStackedDecksTable(props);

  return (
    <StackedDecksResultsTable
      table={table}
      {...data}
      toggles={
        <ColumnVisibilityToggles
          table={table}
          columns={ADVANCED_SECONDARY_COLUMNS}
        />
      }
    />
  );
}
