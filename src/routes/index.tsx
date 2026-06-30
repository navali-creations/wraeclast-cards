import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "../app/queryClient";
import { dropRatesIndexQueryOptions } from "../features/homepage/api/dropRatesIndex";
import { HomepagePage } from "../features/homepage/routes/homepage";

export const Route = createFileRoute("/")({
  component: HomepagePage,
  loader: () => queryClient.prefetchQuery(dropRatesIndexQueryOptions),
});
