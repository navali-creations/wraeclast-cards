import { useGameContext } from "../../../../../app/game-context";
import { useLeagueContext } from "../../../../../app/league-context";
import { CardLink } from "../../../../../components/DivinationCard/CardLink/CardLink";
import { PageContent } from "../../../../../components/page-content/PageContent/PageContent";
import { PageHeader } from "../../../../../components/page-header/PageHeader/PageHeader";
import { Pagination } from "../../../../../components/pagination";
import { divinationCardSlug } from "../../../../../lib/divinationCards";
import { useLeagueDropRates } from "../../../../../lib/dropRates";
import { useUrlPagination } from "../../../../../lib/useUrlPagination";
import { CardsGridSkeleton } from "../../../components/CardsGrid/CardsGridSkeleton";
import { EmptyMessage } from "../../../components/CardsGrid/EmptyMessage";

const PAGE_SIZE = 24;

export function ObservedCardsPage() {
  const { game } = useGameContext();
  const { selectedLeague, selectedLeagueId } = useLeagueContext();
  const { data, isLoading, error } = useLeagueDropRates(game, selectedLeagueId);
  const { page, setPage } = useUrlPagination("/$game/$league/cards/");
  const cards = (data?.cards ?? [])
    .filter((card) => card.count > 0)
    .sort((left, right) => right.count - left.count);
  const totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageCards = cards.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function renderContent() {
    if (isLoading) return <CardsGridSkeleton />;
    if (error) {
      return <EmptyMessage>Failed to load card observations.</EmptyMessage>;
    }
    if (cards.length === 0) {
      return <EmptyMessage>No observed cards are available.</EmptyMessage>;
    }

    return (
      <div className="flex flex-col gap-6">
        <ul className="divide-y divide-(--wc-border-dimmed) rounded-lg border border-(--wc-border-dimmed) bg-(--wc-bg-dimmed)">
          {pageCards.map((card) => (
            <li key={card.name}>
              <CardLink
                cardId={divinationCardSlug(card.name)}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-base-content/5"
              >
                <span className="text-(--wc-text-80)">{card.name}</span>
                <span className="shrink-0 tabular-nums text-(--wc-text-50)">
                  {card.count.toLocaleString("en-US")} drops
                </span>
              </CardLink>
            </li>
          ))}
        </ul>
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>
    );
  }

  const content = renderContent();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Divination Cards"
        subtitle={`${selectedLeague.name} cards with observed stacked deck drops`}
      />
      <PageContent>
        <div className="mx-auto flex min-h-0 w-full max-w-300 flex-1 flex-col px-4 py-6">
          {content}
        </div>
      </PageContent>
    </div>
  );
}
