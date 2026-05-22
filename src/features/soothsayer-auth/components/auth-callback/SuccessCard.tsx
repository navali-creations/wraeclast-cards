import { MdCheckCircle } from "react-icons/md";
import { ButtonAnchor } from "../button";
import { AuthCard } from "./AuthCard";
import { useOAuthCallbackState } from "./OAuthCallbackContext";

export function SuccessCard() {
  const state = useOAuthCallbackState();
  if (state.phase === "invalid") return null;

  return (
    <AuthCard
      tone="default"
      icon={<MdCheckCircle className="h-12 w-12 text-success" />}
      title="Authorization successful!"
      description="Opening Soothsayer..."
      actions={
        <ButtonAnchor variant="subtle" className="mb-4" href={state.deepLink}>
          Open Soothsayer manually
        </ButtonAnchor>
      }
      showFootnote
    />
  );
}
