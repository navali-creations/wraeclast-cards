import { type CSSProperties, useRef } from "react";
import { preload } from "react-dom";
import { DivinationCard } from "../../../../components/DivinationCard";
import { CardLink } from "../../../../components/DivinationCard/CardLink/CardLink";
import { Pagination } from "../../../../components/pagination";
import { useUrlPagination } from "../../../../lib/useUrlPagination";
import { useCardsQuery } from "../../hooks";
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
}

export function CardsGrid({ data, emptyMessage }: CardsGridProps) {
  const { isLoading, error } = useCardsQuery();
  const { page, setPage } = useUrlPagination("/cards/");
  const animatedPageRef = useRef<number | null>(null);
  const pageSize = useCardsPageSize();

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);

  for (const card of data.slice(
    (safePage - 1) * pageSize,
    (safePage + 1) * pageSize,
  )) {
    if (card.imageUrl) preload(card.imageUrl, { as: "image" });
  }

  if (error) return <EmptyMessage>Failed to load cards.</EmptyMessage>;

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
