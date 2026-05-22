import { useSearch } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import { parseOAuthCallback } from "../../api/oauth-utils";
import type { OAuthCallbackState } from "../../types";

const OAuthCallbackContext = createContext<OAuthCallbackState | null>(null);

export const OAuthCallbackProvider = OAuthCallbackContext.Provider;

export function useOAuthCallback(): OAuthCallbackState {
  const params = useSearch({ from: "/soothsayer/auth" });
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

  if (phase === "invalid") return { phase };
  if (phase === "error")
    return { phase, deepLink, errorDescription: params.error_description };
  return { phase, deepLink };
}

export function useOAuthCallbackContext(): OAuthCallbackState {
  const state = useContext(OAuthCallbackContext);
  if (!state)
    throw new Error(
      "useOAuthCallbackContext must be used within OAuthCallbackProvider",
    );
  return state;
}
