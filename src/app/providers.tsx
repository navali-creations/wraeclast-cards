import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "../router";
import { GameProvider } from "./game-context";

const queryClient = new QueryClient();

export function AppProviders() {
  return (
    <GameProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GameProvider>
  );
}
