import { ButtonAnchor, ButtonLink } from "../button";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";
import { useOAuthCallbackState } from "./OAuthCallbackContext";

export function ErrorCard() {
  const state = useOAuthCallbackState();
  if (state.phase !== "error") return null;

  return (
    <AuthCard
      tone="error"
      icon={<Spinner tone="error" />}
      title="Couldn't open Soothsayer"
      description={
        state.errorDescription ??
        "The app may not be installed, or the protocol handler isn't registered. Download Soothsayer and try again."
      }
      actions={
        <>
          <ButtonAnchor variant="error" href={state.deepLink}>
            Try again
          </ButtonAnchor>
          <ButtonLink variant="subtle" to="/downloads">
            Download Soothsayer -&gt;
          </ButtonLink>
        </>
      }
      showFootnote
    />
  );
}
