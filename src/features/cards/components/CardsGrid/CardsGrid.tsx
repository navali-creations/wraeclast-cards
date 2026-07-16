import { DivinationCard } from "../../../../components/DivinationCard";
import { CardLink } from "../../../../components/DivinationCard/CardLink/CardLink";
import { Pagination } from "../../../../components/pagination";
import { useUrlPagination } from "../../../../lib/useUrlPagination";
import type { Card } from "../../types";
import { ScrollToTop } from "..";
import {
  CARDS_GRID_CLASS_NAME,
  CARDS_GRID_SCALE_CLASS_NAME,
  useCardsPageSize,
} from "./CardsGrid.utils";
import { CardsGridSkeleton } from "./CardsGridSkeleton";
import { EmptyMessage } from "./EmptyMessage";

interface CardsGridProps {
  data: Card[];
  emptyMessage?: string;
  hasError: boolean;
  isLoading: boolean;
}

export function CardsGrid({
  data,
  emptyMessage,
  hasError,
  isLoading,
}: CardsGridProps) {
  const { page, setPage } = useUrlPagination("/$game/$league/cards/");
  const pageSize = useCardsPageSize();

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);

  if (hasError) return <EmptyMessage>Failed to load cards.</EmptyMessage>;

  if (isLoading) return <CardsGridSkeleton />;

  if (!data.length)
    return (
      <EmptyMessage>
        {emptyMessage ?? "No cards match your search."}
      </EmptyMessage>
    );

  const pageData = data.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="flex flex-col gap-6">
      <ScrollToTop />
      <ul className={CARDS_GRID_CLASS_NAME}>
        {pageData.map((card) => (
          <li key={card.id} className="list-none">
            <CardLink cardId={card.id} className="block">
              <DivinationCard
                card={card}
                scaleClassName={CARDS_GRID_SCALE_CLASS_NAME}
              />
            </CardLink>
          </li>
        ))}
      </ul>
      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
