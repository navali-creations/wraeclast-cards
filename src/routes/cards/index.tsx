import { createFileRoute } from "@tanstack/react-router";
import type { SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import { Button } from "../../components/buttons";
import { CardsFilters, CardsResults } from "../../features/cards/components";
import { createSearchUpdater } from "../../lib/searchNavigation";

type CardsSearchParams = {
  name?: string;
  sortBy?: string;
  sortDesc?: boolean;
};

export const Route = createFileRoute("/cards/")({
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === "string" ? search.name : undefined,
    sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
    sortDesc:
      search.sortDesc === true || search.sortDesc === "true" ? true : undefined,
  }),
  component: CardsPage,
});

const SORT_FIELDS: Record<string, string> = {
  Name: "name",
};

function CardsPage() {
  const { name, sortBy, sortDesc } = Route.useSearch();
  const navigate = Route.useNavigate();
  const updateSearch = createSearchUpdater<CardsSearchParams>(navigate);

  const searchTerm = name ?? "";
  const activeDesc = sortDesc ?? false;

  const setSearchTerm = (value: string) => {
    updateSearch({ name: value || undefined });
  };

  const setSorting = (newSorting: SortingState) => {
    const sortEntry = newSorting[0];
    updateSearch({
      sortBy:
        sortEntry?.id === "name" && !sortEntry?.desc
          ? undefined
          : sortEntry?.id,
      sortDesc: sortEntry?.desc || undefined,
    });
  };

  const activeSortLabel =
    Object.keys(SORT_FIELDS).find(
      (label) => SORT_FIELDS[label] === (sortBy ?? "name"),
    ) ?? null;

  const handleSortChipClick = (label: string) => {
    const fieldId = SORT_FIELDS[label];
    if (!fieldId) return;
    const isActive = activeSortLabel === label;
    setSorting([{ id: fieldId, desc: isActive ? !activeDesc : false }]);
  };

  return (
    <div className="-mx-4 -mt-6 -mb-6 flex flex-1 flex-col min-h-0">
      <div className="space-y-4 border-b border-[color-mix(in_oklch,var(--wc-border)_65%,black)] px-4 pt-5 pb-4 shadow-[inset_0_-16px_36px_-28px_black]">
        <div>
          <h1 className="font-fontin text-4xl leading-none font-bold tracking-tight text-[color-mix(in_oklch,var(--wc-gold)_88%,white)] sm:text-5xl">
            Divination Cards
          </h1>
        </div>

        <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
          <CardsFilters value={searchTerm} onChange={setSearchTerm} />

          <div className="flex items-center gap-2 self-end xs:self-auto">
            {Object.keys(SORT_FIELDS).map((label) => {
              const isActive = activeSortLabel === label;
              return (
                <Button
                  key={label}
                  onClick={() => handleSortChipClick(label)}
                  className={clsx(
                    "rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors",
                    isActive
                      ? "border-(--wc-accent-border) bg-(--wc-glow) font-semibold text-(--wc-gold-bright)"
                      : "border-(--wc-border) text-(--wc-text-60) hover:border-(--wc-accent-border) hover:text-(--wc-text-80)",
                  )}
                >
                  {label}
                  {isActive && (
                    <span className="ml-1">{activeDesc ? "↓" : "↑"}</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative left-1/2 mt-3 flex w-screen -translate-x-1/2 flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col px-4 py-6 min-h-0">
          <CardsResults
            searchTerm={searchTerm}
            sorting={[{ id: sortBy ?? "name", desc: activeDesc }]}
            onSortingChange={setSorting}
          />
        </div>
      </div>
    </div>
  );
}
