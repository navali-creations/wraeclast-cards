import { createFileRoute } from "@tanstack/react-router";
import { dropRatesIndexQueryOptions } from "../../features/homepage/api/dropRatesIndex";
import { HomepagePage } from "../../features/homepage/routes/homepage";

export const Route = createFileRoute("/$game/")({
  component: HomepagePage,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(dropRatesIndexQueryOptions),
});
