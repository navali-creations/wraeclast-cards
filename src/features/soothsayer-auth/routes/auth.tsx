import { SoothsayerAuth } from "../components";
import type { OAuthCallbackParams } from "../types";

export function validateSearch(
  search: Record<keyof OAuthCallbackParams, string | undefined>,
): OAuthCallbackParams {
  return {
    code: search.code,
    state: search.state,
    error: search.error,
    error_description: search.error_description,
  };
}

export function SoothsayerAuthPage() {
  return <SoothsayerAuth />;
}
