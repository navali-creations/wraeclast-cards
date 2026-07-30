import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { router } from "../router";
import type { queryClient } from "./queryClient";

interface AppProvidersProps {
  queryClient: typeof queryClient;
  router: typeof router;
  routerContent?: ReactNode;
}

export function AppProviders({
  queryClient,
  router,
  routerContent,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {routerContent ?? <RouterProvider router={router} />}
    </QueryClientProvider>
  );
}
