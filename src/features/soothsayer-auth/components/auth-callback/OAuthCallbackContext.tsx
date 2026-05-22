import { createContext, useContext } from "react";
import type { OAuthCallbackState } from "../../types";

const OAuthCallbackContext = createContext<OAuthCallbackState | null>(null);

export const OAuthCallbackProvider = OAuthCallbackContext.Provider;

export function useOAuthCallbackState(): OAuthCallbackState {
  const state = useContext(OAuthCallbackContext);
  if (!state)
    throw new Error(
      "useOAuthCallbackState must be used within OAuthCallbackProvider",
    );
  return state;
}
