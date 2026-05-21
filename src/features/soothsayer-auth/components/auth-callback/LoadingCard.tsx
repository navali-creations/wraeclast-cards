import { Spinner } from "../Spinner";
import { AuthCard } from "./AuthCard";

export function LoadingCard() {
  return (
    <AuthCard
      tone="default"
      icon={<Spinner />}
      title="Opening Soothsayer..."
      description="Opening the Soothsayer desktop app to complete your sign-in. This should only take a moment."
      showFootnote
    />
  );
}
