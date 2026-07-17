import { type CSSProperties, useRef } from "react";
import { DivinationCard } from "../../../../components/DivinationCard";
import { CardLink } from "../../../../components/DivinationCard/CardLink/CardLink";
import { Pagination } from "../../../../components/pagination";
import { useUrlPagination } from "../../../../lib/useUrlPagination";
import type { Card } from "../../types";
import { ScrollToTop } from "..";
import "./CardsGrid.css";
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
  const animatedPageRef = useRef<number | null>(null);
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

  if (animatedPageRef.current === null) {
    animatedPageRef.current = safePage;
  }

  const pageData = data.slice((safePage - 1) * pageSize, safePage * pageSize);
  const shouldAnimateCards = animatedPageRef.current === safePage;

  return (
    <div className="flex flex-col gap-6">
      <ScrollToTop />
      <ul className={CARDS_GRID_CLASS_NAME}>
        {pageData.map((card, idx) => (
          <li
            key={card.id}
            className={`list-none${shouldAnimateCards ? " wc-card-enter" : ""}`}
            style={{ "--card-stagger": idx } as CSSProperties}
          >
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
