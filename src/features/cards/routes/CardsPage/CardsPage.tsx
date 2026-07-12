import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useLeagueContext } from "../../../../app/league-context";
import { Heading } from "../../../../components/headings";
import { Text } from "../../../../components/text";
import { getNameSuggestions } from "../../../../lib/nameSuggestions";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import { useDebounce } from "../../../../lib/useDebounce";
import {
  type CardsSearchParams,
  Route,
} from "../../../../routes/$game/$league/cards";
import { CardsFilters, CardsResults } from "../../components";
import { useCardsQuery } from "../../hooks";
import type { Card } from "../../types";
import { SortChips } from "./SortChips";

const SORT_LABEL = "Name";
const SORT_FIELD = "name";

function searchCards(cards: Card[], normalizedSearch: string): Card[] {
  if (!normalizedSearch) return cards;

  return cards.filter((card) => {
    const haystack = [
      card.name,
      card.flavourText ?? "",
      card.rewardText,
      card.dropLocations.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalizedSearch);
  });
}

function sortCards(cards: Card[], sorting: SortingState): Card[] {
  const sortEntry = sorting[0];
  if (!sortEntry) return cards;

  return [...cards].sort((a, b) => {
    const aVal = a[sortEntry.id as keyof Card];
    const bVal = b[sortEntry.id as keyof Card];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortEntry.desc ? -cmp : cmp;
  });
}

export function CardsPage() {
  const { name, sortBy = "name", sortDesc } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<CardsSearchParams>(navigate);
  const { selectedLeague } = useLeagueContext();

  const searchTerm = name ?? "";
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const activeDesc = sortDesc ?? false;

  const { data: cardsData } = useCardsQuery();
  const cards = cardsData ?? [];
  const cardNames = useMemo(() => cards.map((card) => card.name), [cards]);
  const suggestions = useMemo(
    () => getNameSuggestions(cardNames, debouncedSearchTerm),
    [cardNames, debouncedSearchTerm],
  );
  const sorting = useMemo(
    () => [{ id: sortBy, desc: activeDesc }],
    [sortBy, activeDesc],
  );
  const filteredCards = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm.trim().toLowerCase();
    return sortCards(searchCards(cards, normalizedSearch), sorting);
  }, [cards, debouncedSearchTerm, sorting]);

  const setSearchTerm = (value: string) => {
    updateSearch({ name: value || undefined, page: undefined });
  };

  const setSorting = (newSorting: SortingState) => {
    const sortEntry = newSorting[0];
    updateSearch({
      sortBy:
        sortEntry?.id !== SORT_FIELD || sortEntry?.desc
          ? sortEntry?.id
          : undefined,
      sortDesc: sortEntry?.desc || undefined,
      page: undefined,
    });
  };

  const activeSortLabel = sortBy === SORT_FIELD ? SORT_LABEL : null;
  const cardCount = cardsData ? filteredCards.length : undefined;

  const handleSortChipClick = () => {
    setSorting([
      { id: SORT_FIELD, desc: activeSortLabel ? !activeDesc : false },
    ]);
  };

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-3 px-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading
              as="h1"
              className="leading-none tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl"
            >
              Divination Cards
            </Heading>
            <Text size="sm" className="mt-1 min-h-5 text-(--wc-text-70)">
              {cardCount !== undefined && (
                <>
                  <Text
                    as="span"
                    weight="semibold"
                    className="text-(--wc-gold)"
                  >
                    {cardCount.toLocaleString()}
                  </Text>{" "}
                  cards · {selectedLeague.name} league
                </>
              )}
            </Text>
          </div>

          <div className="flex shrink-0 flex-col gap-3 xs:flex-row xs:items-center">
            <CardsFilters
              value={searchTerm}
              onChange={setSearchTerm}
              suggestions={suggestions}
            />

            <SortChips
              labels={[SORT_LABEL]}
              activeLabel={activeSortLabel}
              activeDesc={activeDesc}
              onSelect={handleSortChipClick}
            />
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults cards={filteredCards} />
        </div>
      </div>
    </div>
  );
}
