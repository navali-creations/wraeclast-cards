import { createFileRoute } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import { CardsFilters } from "../../features/cards/components/controls/CardsFilters";
import { CardsResults } from "../../features/cards/components/sections/CardsResults";

export const Route = createFileRoute("/cards/")({
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === "string" ? search.name : undefined,
    sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
    sortDesc:
      search.sortDesc === true || search.sortDesc === "true" ? true : undefined,
  }),
  component: CardsPage,
});

const SORT_CHIPS = ["Name ↑", "Price"];

const SORT_MAP: Record<string, SortingState> = {
  "Name ↑": [{ id: "name", desc: false }],
};

function CardsPage() {
  const { name, sortBy, sortDesc } = Route.useSearch();
  const navigate = Route.useNavigate();

  const searchTerm = name ?? "";
  const sorting: SortingState = [
    { id: sortBy ?? "name", desc: sortDesc ?? false },
  ];

  const setSearchTerm = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, name: value || undefined }) });

  const setSorting = (newSorting: SortingState) => {
    const s = newSorting[0];
    navigate({
      search: (prev) => ({
        ...prev,
        sortBy: s?.id === "name" && !s?.desc ? undefined : s?.id,
        sortDesc: s?.desc || undefined,
      }),
    });
  };

  const activeSortLabel =
    SORT_CHIPS.find((label) => {
      const s = SORT_MAP[label];
      return (
        s &&
        s[0]?.id === (sortBy ?? "name") &&
        s[0]?.desc === (sortDesc ?? false)
      );
    }) ?? null;

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

          <div className="flex items-center gap-2 self-start">
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
                  className={clsx(
                    "rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors",
                    isDisabled &&
                      "cursor-not-allowed border-(--wc-border) text-(--wc-text-50) opacity-40",
                    !isDisabled &&
                      isActive &&
                      "border-(--wc-accent-border) bg-(--wc-glow) font-semibold text-(--wc-gold-bright)",
                    !isDisabled &&
                      !isActive &&
                      "border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:text-(--wc-text-80)",
                  )}
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
