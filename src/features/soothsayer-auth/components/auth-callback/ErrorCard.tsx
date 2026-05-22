import { ButtonExternalLink, ButtonInternalLink } from "../buttons";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";

interface ErrorCardProps {
  deepLink: string;
  errorDescription?: string;
}

export function ErrorCard({ deepLink, errorDescription }: ErrorCardProps) {
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
