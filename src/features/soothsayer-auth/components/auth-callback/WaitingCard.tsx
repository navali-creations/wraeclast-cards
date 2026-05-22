import { ButtonExternalLink } from "../buttons";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";

interface WaitingCardProps {
  deepLink: string;
}

export function WaitingCard({ deepLink }: WaitingCardProps) {
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
