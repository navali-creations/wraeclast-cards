import { ButtonAnchor } from "../button";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";
import { useOAuthCallbackState } from "./OAuthCallbackContext";

export function WaitingCard() {
  const state = useOAuthCallbackState();
  if (state.phase === "invalid") return null;

  return (
    <AuthCard
      tone="default"
      icon={<Spinner />}
      title="Opening Soothsayer..."
      description="If a dialog appeared asking you to open the app, click Allow or Open."
      actions={
        <ButtonAnchor variant="primary" href={state.deepLink}>
          Open Soothsayer manually
        </ButtonAnchor>
      }
      showFootnote
    />
  );
}
