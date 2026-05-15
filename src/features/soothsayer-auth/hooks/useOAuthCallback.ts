import { useLayoutEffect, useMemo, useState } from "react";
import { buildDeepLink, resolveCallbackPhase } from "../api/oauth-utils";
import type { OAuthCallbackParams, OAuthCallbackState } from "../types";

export function useOAuthCallback(
  params: OAuthCallbackParams,
): OAuthCallbackState {
  const [phase, setPhase] = useState<OAuthCallbackState["phase"]>("loading");

  const computed = useMemo(() => {
    const resolvedPhase = resolveCallbackPhase(params);
    const deepLink = buildDeepLink(params);
    return { resolvedPhase, deepLink };
  }, [params]);

  useLayoutEffect(() => {
    const { resolvedPhase, deepLink } = computed;

    if (resolvedPhase === "invalid" || resolvedPhase === "error") {
      setPhase(resolvedPhase);
      return;
    }

    window.location.href = deepLink;
    setPhase("waiting");

    const closeTimer = setTimeout(() => {
      setPhase("success");
      window.close();
    }, 2000);

    return () => clearTimeout(closeTimer);
  }, [computed]);

  return {
    phase,
    deepLink: computed.deepLink,
  };
}
