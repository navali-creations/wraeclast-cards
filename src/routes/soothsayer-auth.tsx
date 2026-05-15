import { createFileRoute } from "@tanstack/react-router";
import { SoothsayerAuth } from "../features/soothsayer-auth/components";
import type { OAuthCallbackParams } from "../features/soothsayer-auth/types";

export const Route = createFileRoute("/soothsayer-auth")({
  validateSearch: (search: Record<string, unknown>): OAuthCallbackParams => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
    error: search.error as string | undefined,
    error_description: search.error_description as string | undefined,
  }),
  component: SoothsayerAuthPage,
});

function SoothsayerAuthPage() {
  const params = Route.useSearch();
  return <SoothsayerAuth params={params} />;
}
