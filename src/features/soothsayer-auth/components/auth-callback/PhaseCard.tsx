import type { OAuthCallbackState } from "../../types";
import { ErrorCard } from "./ErrorCard";
import { InvalidCard } from "./InvalidCard";
import { LoadingCard } from "./LoadingCard";
import { SuccessCard } from "./SuccessCard";
import { WaitingCard } from "./WaitingCard";

interface PhaseCardProps {
  state: OAuthCallbackState;
  onManualOpen: () => void;
  onDownload: () => void;
}

export function PhaseCard({ state, onManualOpen, onDownload }: PhaseCardProps) {
  switch (state.phase) {
    case "loading":
      return <LoadingCard />;
    case "waiting":
      return <WaitingCard onManualOpen={onManualOpen} />;
    case "success":
      return <SuccessCard onManualOpen={onManualOpen} />;
    case "error":
      return (
        <ErrorCard
          description={state.errorDescription}
          onManualOpen={onManualOpen}
          onDownload={onDownload}
        />
      );
    case "invalid":
      return <InvalidCard />;
  }
}
