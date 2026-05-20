import { useEffect, useState } from "react";
import { parseOAuthCallback } from "../api/oauth-utils";
import type { OAuthCallbackParams, OAuthCallbackState } from "../types";

export function useOAuthCallback(
  params: OAuthCallbackParams,
): OAuthCallbackState {
  const { resolvedPhase, deepLink } = parseOAuthCallback(params);

  const [phase, setPhase] = useState<OAuthCallbackState["phase"]>(() =>
    resolvedPhase === "invalid" ? resolvedPhase : "loading",
  );

  useEffect(() => {
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
  }, [resolvedPhase, deepLink]);

  if (phase === "invalid") {
    return { phase };
  }

  return { phase, deepLink };
}
