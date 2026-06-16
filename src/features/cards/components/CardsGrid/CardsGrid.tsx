import { useState } from "react";
import { preload } from "react-dom";
import { useCardsQuery } from "../../hooks";
import type { Card } from "../../types";
import { ScrollToTop } from "..";
import { DivinationCard } from "../DivinationCard";
import { CardsGridSkeleton } from "./CardsGridSkeleton";
import { EmptyMessage } from "./EmptyMessage";
import { Pagination } from "./Pagination/Pagination";

export const PAGE_SIZE = 24;

interface CardsGridProps {
  data: Card[];
}

export function CardsGrid({ data }: CardsGridProps) {
  const { isLoading, error } = useCardsQuery();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  function handlePageChange(pageNumber: number) {
    setPage(pageNumber);
  }

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
      <ScrollToTop />
      <ul className="grid grid-cols-2 gap-x-40 gap-y-4 justify-items-center sm:grid-cols-3 md:grid-cols-4">
        {pageData.map((card) => (
          <DivinationCard key={card.id} card={card} />
        ))}
      </ul>
      <Pagination
        page={safePage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
}
