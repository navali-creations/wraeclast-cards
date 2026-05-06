import { createRootRoute } from "@tanstack/react-router";
import { GameProvider } from "../app/game-context";
import { AppLayout } from "../app/layout/AppLayout";

function RootComponent() {
  return (
    <GameProvider>
      <AppLayout />
    </GameProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
