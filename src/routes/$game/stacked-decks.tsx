import { createFileRoute } from "@tanstack/react-router";
import type { StackedDecksView } from "../../features/stackedDecks/components";
import { StackedDecksPage } from "../../features/stackedDecks/routes";
import { asPage, asString, asTrueFlag } from "../../lib/searchParams";

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

export function validateStackedDecksSearch(
  search: Record<string, unknown>,
): StackedDecksSearchParams {
  return {
    sortBy: asString(search.sortBy),
    sortAsc: asTrueFlag(search.sortAsc),
    advancedSortBy: asString(search.advancedSortBy),
    advancedSortAsc: asTrueFlag(search.advancedSortAsc),
    search: asString(search.search),
    page: asPage(search.page),
    verified: asTrueFlag(search.verified),
    view: search.view === "advanced" ? "advanced" : undefined,
  };
}

export const Route = createFileRoute("/$game/stacked-decks")({
  validateSearch: validateStackedDecksSearch,
  component: StackedDecksPage,
});
