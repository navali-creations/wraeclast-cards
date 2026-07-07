import { createFileRoute } from "@tanstack/react-router";
import { CardsPage } from "../../features/cards/routes";
import { asPage, asString, asTrueFlag } from "../../lib/searchParams";

export type CardsSearchParams = {
  name?: string;
  sortBy?: string;
  sortDesc?: true;
  page?: number;
};

export const Route = createFileRoute("/cards/")({
  validateSearch: (search: Record<string, unknown>) => ({
    name: asString(search.name),
    sortBy: asString(search.sortBy),
    sortDesc: asTrueFlag(search.sortDesc),
    page: asPage(search.page),
  }),
  component: CardsPage,
});
