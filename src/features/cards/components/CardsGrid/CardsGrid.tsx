import { useState } from "react";
import type { Card } from "../../types";
import { CardsGridItem } from "../grid-item/CardsGridItem";
import { EmptyMessage } from "./EmptyMessage";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 24;

const SKELETON_IDS = Array.from(
  { length: PAGE_SIZE },
  (_, i) => `grid-skeleton-${i}`,
);

interface CardsGridProps {
  data: Card[];
  isLoading?: boolean;
  error?: Error | null;
}

export function CardsGrid({ data, isLoading, error }: CardsGridProps) {
  const [page, setPage] = useState(1);

  if (error) return <EmptyMessage>Failed to load cards.</EmptyMessage>;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {SKELETON_IDS.map((id) => (
          <div
            key={id}
            className="animate-pulse rounded-sm border border-(--wc-gold-dim) bg-(--wc-card-darker) opacity-50"
            style={{ aspectRatio: "3/4" }}
          />
        ))}
      </div>
    );
  }

  if (!data.length)
    return <EmptyMessage>No cards match your search.</EmptyMessage>;

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageData = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-40 gap-y-4 justify-items-center sm:grid-cols-3 md:grid-cols-4">
        {pageData.map((card) => (
          <CardsGridItem key={card.id} card={card} />
        ))}
      </div>
      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
