import { createFileRoute } from "@tanstack/react-router";
import { dropRatesIndexQueryOptions } from "../features/homepage/api/dropRatesIndex";
import { HomepagePage } from "../features/homepage/routes/homepage";
import { createRootSeoHead } from "../lib/seo";

export const Route = createFileRoute("/")({
  head: createRootSeoHead,
  component: HomepagePage,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(dropRatesIndexQueryOptions),
});
