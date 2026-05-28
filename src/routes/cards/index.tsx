import { createFileRoute } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { CardsFilters } from "../../features/cards/components/CardsFilters";
import { CardsResults } from "../../features/cards/components/CardsResults";

export const Route = createFileRoute("/cards/")({
  component: CardsPage,
});

const SORT_CHIPS = ["Name ↑", "Price"];

const SORT_MAP: Record<string, SortingState> = {
  "Name ↑": [{ id: "name", desc: false }],
};

function CardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);

  const activeSortLabel = useMemo(
    () =>
      SORT_CHIPS.find((label) => {
        const s = SORT_MAP[label];
        return (
          s && sorting[0]?.id === s[0]?.id && sorting[0]?.desc === s[0]?.desc
        );
      }) ?? null,
    [sorting],
  );

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="space-y-4 border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] px-4 pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div>
          <h1 className="font-cinzel text-4xl leading-none font-bold tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl">
            Divination Cards
          </h1>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <CardsFilters value={searchTerm} onChange={setSearchTerm} />

          <div className="flex items-center gap-1 self-start rounded-md border border-[#5a2528] bg-[#2a0608] p-1">
            {SORT_CHIPS.map((label) => {
              const isActive = activeSortLabel === label;
              const isDisabled = !(label in SORT_MAP);
              return (
                <button
                  key={label}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    const s = SORT_MAP[label];
                    if (s) setSorting(s);
                  }}
                  className={
                    isDisabled
                      ? "h-6 cursor-not-allowed rounded-sm border border-transparent px-2.5 text-[11px] font-medium text-[#a78868]/40"
                      : isActive
                        ? "h-6 rounded-sm border border-[#6b2f33] bg-[#3b1013] px-2.5 text-[11px] font-semibold text-[#f2d8b4]"
                        : "h-6 rounded-sm border border-transparent bg-transparent px-2.5 text-[11px] font-medium text-[#a78868] hover:border-[#5d2f32] hover:text-[#d6b68f]"
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-[#e8dcc8] min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults
            searchTerm={searchTerm}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </div>
  );
}
