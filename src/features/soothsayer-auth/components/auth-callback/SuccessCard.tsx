import { MdCheckCircle } from "react-icons/md";
import { ButtonExternalLink } from "../../../../components/buttons";
import { useOAuthCallbackContext } from "../../contexts/OAuthCallbackContext";
import { AuthCard } from "./AuthCard/AuthCard";

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
