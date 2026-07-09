import { Route } from "../../../../routes/$game/stacked-decks";
import {
  Methodology,
  StackedDecksAdvancedResults,
  StackedDecksResults,
} from "../../components";
import { useStackedDecksData } from "../../hooks";
import { StackedDecksHeader } from "./StackedDecksHeader";

export function StackedDecksPage() {
  const { view = "standard" } = Route.useSearch();
  const { league, leagueData, totalCount } = useStackedDecksData();
  const isAdvancedView = view === "advanced";

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <StackedDecksHeader
        // Gated on leagueData (the drop-rate query totalCount comes from), not on
        // league (the league metadata), so the count doesn't flash in before it's ready.
        summary={
          leagueData ? { totalCount, leagueName: league?.name } : undefined
        }
      />

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-6 min-h-0">
          <Methodology />
          {/*
            Both views stay mounted and are toggled with hidden/contents rather than
            conditionally rendered, so switching views doesn't reset each view's own
            sorting/scroll state or refetch its data.
          */}
          <div className={isAdvancedView ? "hidden" : "contents"}>
            <StackedDecksResults />
          </div>
          <div className={isAdvancedView ? "contents" : "hidden"}>
            <StackedDecksAdvancedResults />
          </div>
        </div>
      </div>
    </div>
  );
}
