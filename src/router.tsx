import { dehydrate, hydrate, type QueryClient } from "@tanstack/react-query";
import { type createMemoryHistory, createRouter } from "@tanstack/react-router";
import { queryClient } from "./app/queryClient";
import { routeTree } from "./routeTree.gen";

interface CreateAppRouterOptions {
  queryClient: QueryClient;
  history?: ReturnType<typeof createMemoryHistory>;
  isServer?: boolean;
  prerender?: boolean;
}

export function createAppRouter({
  queryClient: client,
  history,
  isServer,
  prerender = false,
}: CreateAppRouterOptions) {
  return createRouter({
    routeTree,
    context: { queryClient: client, prerender },
    history,
    isServer,
    dehydrate: () => ({
      queryClient: JSON.stringify(dehydrate(client)),
    }),
    hydrate: (dehydratedState) => {
      hydrate(client, JSON.parse(dehydratedState.queryClient));
    },
  });
}

export const router = createAppRouter({
  queryClient,
  prerender: typeof window !== "undefined" && Boolean(window.$_TSR?.router),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
