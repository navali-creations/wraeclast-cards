import { PageHeader } from "../../../../components/page-header/PageHeader/PageHeader";
import { StackedDecksHeaderActions } from "./StackedDecksHeaderActions/StackedDecksHeaderActions";
import { StackedDecksHeaderSubtitle } from "./StackedDecksHeaderSubtitle/StackedDecksHeaderSubtitle";

interface StackedDecksSummary {
  totalCount: number;
  leagueName: string;
}

interface StackedDecksHeaderProps {
  // undefined means "not loaded yet" — the count/league line is hidden until then.
  summary: StackedDecksSummary | undefined;
}

export function StackedDecksHeader({ summary }: StackedDecksHeaderProps) {
  return (
    <PageHeader
      title="Stacked Decks"
      subtitle={
        summary && (
          <StackedDecksHeaderSubtitle
            totalCount={summary.totalCount}
            leagueName={summary.leagueName}
          />
        )
      }
      actions={<StackedDecksHeaderActions />}
    />
  );
}
