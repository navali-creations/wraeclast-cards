import {
  ButtonExternalLink,
  ButtonInternalLink,
} from "../../../../components/buttons";
import { useOAuthCallbackContext } from "../../contexts/OAuthCallbackContext";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard/AuthCard";

export function ErrorCard() {
  const state = useOAuthCallbackContext();
  if (state.phase !== "error") return null;
  const { deepLink, errorDescription } = state;
  return (
    <AuthCard
      tone="error"
      icon={<Spinner tone="error" />}
      title="Couldn't open Soothsayer"
      description={
        errorDescription ??
        "The app may not be installed, or the protocol handler isn't registered. Download Soothsayer and try again."
      }
      actions={
        <>
          <ButtonExternalLink variant="error" href={deepLink}>
            Try again
          </ButtonExternalLink>
          <ButtonInternalLink variant="subtle" to="/downloads">
            Download Soothsayer -&gt;
          </ButtonInternalLink>
        </>
      }
      showFootnote
    />
  );
}
