import clsx from "clsx";
import { useState } from "react";
import type { Card } from "../types";
import { CardsGridItem } from "./CardsGridItem";

const PAGE_SIZE = 24;

const SKELETON_IDS = Array.from(
  { length: PAGE_SIZE },
  (_, i) => `grid-skeleton-${i}`,
);

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-(--wc-border)">
      <p className="text-sm text-(--wc-text-50)">{children}</p>
    </div>
  );
}

type PageToken =
  | { type: "page"; value: number }
  | { type: "ellipsis"; id: "left" | "right" };

function buildPageRange(current: number, total: number): PageToken[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      type: "page" as const,
      value: i + 1,
    }));
  }

  const range: PageToken[] = [{ type: "page", value: 1 }];
  if (current > 3) range.push({ type: "ellipsis", id: "left" });

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) range.push({ type: "page", value: i });

  if (current < total - 2) range.push({ type: "ellipsis", id: "right" });
  range.push({ type: "page", value: total });

  return range;
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const btnClass = (active?: boolean, disabled?: boolean) =>
    clsx(
      "min-w-8 rounded px-2 py-1 text-xs font-medium transition-colors",
      disabled && "cursor-not-allowed opacity-40 text-(--wc-text-50)",
      active &&
        "border border-(--wc-accent-border) bg-(--wc-glow) text-(--wc-gold-bright)",
      !active && !disabled && "text-(--wc-text-60) hover:text-(--wc-text-80)",
    );

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={btnClass(false, page === 1)}
      >
        Previous
      </button>

      {buildPageRange(page, totalPages).map((token) =>
        token.type === "ellipsis" ? (
          <span
            key={`ellipsis-${token.id}`}
            className="px-1 text-xs text-(--wc-text-50)"
          >
            …
          </span>
        ) : (
          <button
            key={token.value}
            type="button"
            onClick={() => onChange(token.value)}
            className={btnClass(token.value === page)}
          >
            {token.value}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={btnClass(false, page === totalPages)}
      >
        Next
      </button>
    </div>
  );
}

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {pageData.map((card) => (
          <CardsGridItem key={card.id} card={card} />
        ))}
      </div>
      <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
