import { ButtonExternalLink } from "../../../../components/buttons";
import { useOAuthCallbackContext } from "../../contexts/OAuthCallbackContext";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard/AuthCard";

export function WaitingCard() {
  const state = useOAuthCallbackContext();
  if (state.phase !== "waiting") return null;
  const { deepLink } = state;
  return (
    <AuthCard
      tone="default"
      icon={<Spinner />}
      title="Opening Soothsayer..."
      description="If a dialog appeared asking you to open the app, click Allow or Open."
      actions={
        <ButtonExternalLink variant="primary" href={deepLink}>
          Open Soothsayer manually
        </ButtonExternalLink>
      }
      showFootnote
    />
  );
}
