import type { OAuthCallbackParams, OAuthCallbackPhase } from "../types";

export function buildDeepLink(params: OAuthCallbackParams): string {
  const base = "soothsayer://oauth/callback";

  if (params.code) {
    const qs = new URLSearchParams({
      code: params.code,
      ...(params.state && { state: params.state }),
    });
    return `${base}?${qs}`;
  }

  if (params.error) {
    const qs = new URLSearchParams({
      error: params.error,
      ...(params.error_description && {
        error_description: params.error_description,
      }),
    });
    return `${base}?${qs}`;
  }

  return base;
}

export function resolveCallbackPhase(
  params: OAuthCallbackParams,
): OAuthCallbackPhase {
  if (!params.code && !params.error) return "invalid";
  if (params.code) return "success";
  if (params.error) return "error";
  return "invalid";
}
