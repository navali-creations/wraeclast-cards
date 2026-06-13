import { useState } from "react";
import { preload } from "react-dom";
import type { Card } from "../../../types";
import { CardsGridItem } from "../item/CardsGridItem";
import { EmptyMessage } from "./EmptyMessage";
import { Pagination } from "./Pagination/Pagination";

const SKELETON_COUNT = 24;

const SKELETON_IDS = Array.from(
  { length: SKELETON_COUNT },
  (_, i) => `grid-skeleton-${i}`,
);

function CardsGridSkeleton() {
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

export const PAGE_SIZE = 24;

interface CardsGridProps {
  data: Card[];
  isLoading?: boolean;
  error?: Error | null;
}

export function CardsGrid({ data, isLoading, error }: CardsGridProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  data
    .slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)
    .forEach((card) => {
      if (card.imageUrl) preload(card.imageUrl, { as: "image" });
    });

  if (error) return <EmptyMessage>Failed to load cards.</EmptyMessage>;

  if (isLoading) return <CardsGridSkeleton />;

  if (!data.length)
    return <EmptyMessage>No cards match your search.</EmptyMessage>;

  const pageData = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid grid-cols-2 gap-x-40 gap-y-4 justify-items-center sm:grid-cols-3 md:grid-cols-4">
        {pageData.map((card) => (
          <CardsGridItem key={card.id} card={card} />
        ))}
      </ul>
      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
