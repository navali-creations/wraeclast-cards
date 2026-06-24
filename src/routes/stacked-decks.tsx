import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heading } from "../components/headings";
import { Text } from "../components/text";
import {
  Methodology,
  StackedDecksFilters,
  StackedDecksResults,
} from "../features/stackedDecks/components";
import { useStackedDecksData } from "../features/stackedDecks/hooks";

type StackedDecksSearchParams = {
  sortBy?: string;
  sortAsc?: true;
  search?: string;
};

export const Route = createFileRoute("/stacked-decks")({
  validateSearch: (
    search: Record<string, unknown>,
  ): StackedDecksSearchParams => ({
    sortBy: typeof search.sortBy === "string" ? search.sortBy : undefined,
    sortAsc:
      search.sortAsc === true || search.sortAsc === "true" ? true : undefined,
    search: typeof search.search === "string" ? search.search : undefined,
  }),
  component: StackedDecksPage,
});

function StackedDecksPage() {
  const { search: searchTerm = "" } = Route.useSearch();
  const navigate = useNavigate();
  const { league, leagueData } = useStackedDecksData("poe1");

  function setSearchTerm(value: string) {
    navigate({
      to: ".",
      search: (prev) => ({ ...prev, search: value || undefined }),
    });
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="border-b border-base-100 pt-5 pb-4">
        <div className="mx-auto flex w-full max-w-300 flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Heading
                as="h1"
                className="leading-none tracking-tight text-(--wc-gold-bright) sm:text-5xl"
              >
                Stacked Decks
              </Heading>
            </div>
            <Text size="sm" className="mt-1 min-h-5 text-(--wc-text-70)">
              {leagueData && (
                <>
                  <Text
                    as="span"
                    weight="semibold"
                    className="text-(--wc-gold)"
                  >
                    {leagueData.total_count.toLocaleString()}
                  </Text>{" "}
                  observations · {league?.name} league
                </>
              )}
            </Text>
          </div>

          <div className="shrink-0">
            <StackedDecksFilters value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col bg-primary-content min-h-0">
        <div className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-6 px-4 py-6 min-h-0">
          <Methodology />
          <StackedDecksResults searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
