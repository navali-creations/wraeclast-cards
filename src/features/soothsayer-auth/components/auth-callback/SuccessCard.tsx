import { MdCheckCircle } from "react-icons/md";
import { ButtonExternalLink } from "../../../../components/buttons";
import { AuthCard } from "./AuthCard";
import { useOAuthCallbackContext } from "./OAuthCallbackContext";

export function SuccessCard() {
  const state = useOAuthCallbackContext();
  if (state.phase !== "success") return null;
  const { deepLink } = state;
  return (
    <AuthCard
      tone="default"
      icon={<MdCheckCircle className="h-12 w-12 text-success" />}
      title="Authorization successful!"
      description="Opening Soothsayer..."
      actions={
        <ButtonExternalLink variant="subtle" className="mb-4" href={deepLink}>
          Open Soothsayer manually
        </ButtonExternalLink>
      }
      showFootnote
    />
  );
}
