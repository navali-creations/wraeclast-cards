import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { getNameSuggestions } from "../../../../lib/nameSuggestions";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import { useDebounce } from "../../../../lib/useDebounce";
import { type CardsSearchParams, Route } from "../../../../routes/$game/cards";
import { CardsFilters, CardsResults } from "../../components";
import { useCardsQuery } from "../../hooks";
import { SortChips } from "./SortChips";

const SORT_FIELDS: Record<string, string> = {
  Name: "name",
};

export function CardsPage() {
  const { name, sortBy = "name", sortDesc } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<CardsSearchParams>(navigate);

  const searchTerm = name ?? "";
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const activeDesc = sortDesc ?? false;

  const { data: cards } = useCardsQuery();
  const cardNames = useMemo(
    () => (cards ?? []).map((card) => card.name),
    [cards],
  );
  const suggestions = useMemo(
    () => getNameSuggestions(cardNames, debouncedSearchTerm),
    [cardNames, debouncedSearchTerm],
  );

  const setSearchTerm = (value: string) => {
    updateSearch({ name: value || undefined, page: undefined });
  };

  const setSorting = (newSorting: SortingState) => {
    const sortEntry = newSorting[0];
    updateSearch({
      sortBy:
        sortEntry?.id !== "name" || sortEntry?.desc ? sortEntry?.id : undefined,
      sortDesc: sortEntry?.desc || undefined,
      page: undefined,
    });
  };

  const activeSortLabel =
    Object.keys(SORT_FIELDS).find((label) => SORT_FIELDS[label] === sortBy) ??
    null;

  const handleSortChipClick = (label: string) => {
    const fieldId = SORT_FIELDS[label];
    if (!fieldId) return;
    const isActive = activeSortLabel === label;
    setSorting([{ id: fieldId, desc: isActive ? !activeDesc : false }]);
  };

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="space-y-4 border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] px-4 pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div>
          <h1 className="font-fontin text-4xl leading-none font-bold tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl">
            Divination Cards
          </h1>
        </div>

        <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
          <CardsFilters
            value={searchTerm}
            onChange={setSearchTerm}
            suggestions={suggestions}
          />

          <SortChips
            labels={Object.keys(SORT_FIELDS)}
            activeLabel={activeSortLabel}
            activeDesc={activeDesc}
            onSelect={handleSortChipClick}
          />
        </div>
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults
            searchTerm={debouncedSearchTerm}
            sorting={[{ id: sortBy, desc: activeDesc }]}
          />
        </div>
      </div>
    </div>
  );
}
