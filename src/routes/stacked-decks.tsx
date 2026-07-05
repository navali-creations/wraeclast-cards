import { createFileRoute } from "@tanstack/react-router";
import type { StackedDecksView } from "../features/stackedDecks/components";
import { StackedDecksPage } from "../features/stackedDecks/routes";
import { asString, asTrueFlag } from "../lib/searchParams";

export type StackedDecksSearchParams = {
  sortBy?: string;
  sortAsc?: true;
  advancedSortBy?: string;
  advancedSortAsc?: true;
  search?: string;
  page?: number;
  verified?: true;
  view?: StackedDecksView;
};

export const Route = createFileRoute("/stacked-decks")({
  validateSearch: (
    search: Record<string, unknown>,
  ): StackedDecksSearchParams => {
    const page = Number(search.page);
    return {
      sortBy: asString(search.sortBy),
      sortAsc: asTrueFlag(search.sortAsc),
      advancedSortBy: asString(search.advancedSortBy),
      advancedSortAsc: asTrueFlag(search.advancedSortAsc),
      search: asString(search.search),
      page: Number.isInteger(page) && page > 1 ? page : undefined,
      verified: asTrueFlag(search.verified),
      view: search.view === "advanced" ? "advanced" : undefined,
    };
  },
  component: StackedDecksPage,
});
