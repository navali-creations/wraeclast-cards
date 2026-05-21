import { Button } from "../Button";
import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";

interface WaitingCardProps {
  onManualOpen: () => void;
}

export function WaitingCard({ onManualOpen }: WaitingCardProps) {
  return (
    <AuthCard
      tone="default"
      icon={<Spinner />}
      title="Opening Soothsayer..."
      description="If a dialog appeared asking you to open the app, click Allow or Open."
      actions={
        <Button variant="primary" onClick={onManualOpen}>
          Open Soothsayer manually
        </Button>
      }
      showFootnote
    />
  );
}
