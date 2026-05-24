import { createRootRoute } from "@tanstack/react-router";
import { GameProvider } from "../app/game-context";
import { AppLayout } from "../app/layout/AppLayout";
import { ButtonInternalLink } from "../components/buttons/ButtonLink";
import { Text } from "../components/text";

function RootComponent() {
  return (
    <GameProvider>
      <AppLayout />
    </GameProvider>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center -my-6 py-24 gap-6 text-center w-screen ml-[calc(50%-50vw)] bg-(--color-primary-content)">
      <Text weight="bold" className="text-8xl text-error">
        404
      </Text>
      <div className="flex flex-col gap-2">
        <Text as="h1" weight="bold" className="text-2xl text-error">
          Page not found
        </Text>
        <Text className="text-error">
          The page you are looking for does not exist or has been moved.
        </Text>
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
