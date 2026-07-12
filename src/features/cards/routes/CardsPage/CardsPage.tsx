import type { SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { useLeagueContext } from "../../../../app/league-context";
import { PageHeader } from "../../../../components/page-header/PageHeader/PageHeader";
import { getNameSuggestions } from "../../../../lib/nameSuggestions";
import { createSearchUpdater } from "../../../../lib/searchNavigation";
import { useDebounce } from "../../../../lib/useDebounce";
import {
  type CardsSearchParams,
  Route,
} from "../../../../routes/$game/$league/cards";
import { CardsResults } from "../../components";
import { useCardsQuery } from "../../hooks";
import {
  CARD_NAME_SORT,
  CARD_SORT_LABELS,
  searchCards,
  sortCards,
} from "./CardsPage.utils";
import { CardsPageActions } from "./CardsPageActions/CardsPageActions";
import { CardsPageSubtitle } from "./CardsPageSubtitle/CardsPageSubtitle";

export function CardsPage() {
  const { name, sortBy = CARD_NAME_SORT.field, sortDesc } = Route.useSearch();
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
        sortEntry?.id !== CARD_NAME_SORT.field || sortEntry?.desc
          ? sortEntry?.id
          : undefined,
      sortDesc: sortEntry?.desc || undefined,
      page: undefined,
    });
  };

  const activeSortLabel =
    sortBy === CARD_NAME_SORT.field ? CARD_NAME_SORT.label : null;
  const cardCount = cardsData ? filteredCards.length : undefined;

  const handleSortChipClick = () => {
    setSorting([
      {
        id: CARD_NAME_SORT.field,
        desc: activeSortLabel ? !activeDesc : false,
      },
    ]);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <PageHeader
        title="Divination Cards"
        subtitle={
          <CardsPageSubtitle
            cardCount={cardCount}
            leagueName={selectedLeague.name}
          />
        }
        actions={
          <CardsPageActions
            searchTerm={searchTerm}
            suggestions={suggestions}
            sortLabels={CARD_SORT_LABELS}
            activeSortLabel={activeSortLabel}
            activeDesc={activeDesc}
            onSearchChange={setSearchTerm}
            onSortClick={handleSortChipClick}
          />
        }
      />

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults cards={filteredCards} />
        </div>
      </div>
    </div>
  );
}
