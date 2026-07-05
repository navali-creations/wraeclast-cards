import { useMemo } from "react";
import { getNameSuggestions } from "../../../../lib/nameSuggestions";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import { useDebounce } from "../../../../lib/useDebounce";
import {
  Route,
  type StackedDecksSearchParams,
} from "../../../../routes/stacked-decks";
import {
  Methodology,
  StackedDecksAdvancedResults,
  StackedDecksResults,
  type StackedDecksView,
} from "../../components";
import { useStackedDecksData } from "../../hooks";
import { StackedDecksHeader } from "./StackedDecksHeader";

export function StackedDecksPage() {
  const {
    search: searchTerm = "",
    verified = false,
    view = "standard",
  } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<StackedDecksSearchParams>(navigate);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { league, leagueData, rows, totalCount } = useStackedDecksData("poe1");
  const isAdvancedView = view === "advanced";

  const suggestions = useMemo(
    () =>
      getNameSuggestions(
        (rows ?? []).map((row) => row.name),
        searchTerm,
      ),
    [rows, searchTerm],
  );

  function setSearchTerm(value: string) {
    // Reset page so a new search doesn't strand the user past the last matching page.
    updateSearch({ search: value || undefined, page: undefined });
  }

  function setVerified(value: boolean) {
    updateSearch({ verified: value || undefined });
  }

  function setView(value: StackedDecksView) {
    updateSearch({ view: value === "standard" ? undefined : value });
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <StackedDecksHeader
        // Gated on leagueData (the drop-rate query totalCount comes from), not on
        // league (the league metadata), so the count doesn't flash in before it's ready.
        summary={
          leagueData ? { totalCount, leagueName: league?.name } : undefined
        }
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        suggestions={suggestions}
        view={view}
        onViewChange={setView}
        verified={verified}
        onVerifiedChange={setVerified}
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
            <StackedDecksResults
              searchTerm={debouncedSearchTerm}
              verified={verified}
            />
          </div>
          <div className={isAdvancedView ? "contents" : "hidden"}>
            <StackedDecksAdvancedResults
              searchTerm={debouncedSearchTerm}
              verified={verified}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
