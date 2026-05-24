import { createRootRoute } from "@tanstack/react-router";
import { GameProvider } from "../app/game-context";
import { AppLayout } from "../app/layout/AppLayout";
import { ButtonInternalLink } from "../components/buttons/ButtonLink";

function RootComponent() {
  return (
    <GameProvider>
      <AppLayout />
    </GameProvider>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <p className="text-8xl font-bold text-base-content/20">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-base-content/60">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <ButtonInternalLink variant="primary" to="/" className="w-auto!">
        Back to homepage
      </ButtonInternalLink>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});
