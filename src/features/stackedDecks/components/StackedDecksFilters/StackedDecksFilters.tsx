import { useMemo } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { SearchInput } from "../../../../components/input";
import { getNameSuggestions } from "../../../../lib/nameSuggestions";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import {
  Route,
  type StackedDecksSearchParams,
} from "../../../../routes/$game/stacked-decks";
import { useStackedDecksData } from "../../hooks";

export function StackedDecksFilters() {
  const { search: searchTerm = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<StackedDecksSearchParams>(navigate);
  const { rows } = useStackedDecksData();

  const suggestions = useMemo(
    () =>
      getNameSuggestions(
        (rows ?? []).map((row) => row.name),
        searchTerm,
      ),
    [rows, searchTerm],
  );

  function handleChange(value: string) {
    // Reset page so a new search doesn't strand the user past the last matching page.
    updateSearch({ search: value || undefined, page: undefined });
  }

  return (
    <SearchInput
      value={searchTerm}
      onChange={handleChange}
      suggestions={suggestions}
      placeholder="Search..."
      leftIcon={<HiMagnifyingGlass className="size-4" />}
      containerClassName="w-full sm:max-w-sm"
    />
  );
}
