import { ErrorCard } from "./ErrorCard";
import { InvalidCard } from "./InvalidCard";
import { LoadingCard } from "./LoadingCard";
import { useOAuthCallbackContext } from "./OAuthCallbackContext";
import { SuccessCard } from "./SuccessCard";
import { WaitingCard } from "./WaitingCard";

export function PhaseCard() {
  const state = useOAuthCallbackContext();
  const { phase } = state;
  switch (phase) {
    case "loading":
      return <LoadingCard />;
    case "waiting":
      return <WaitingCard deepLink={state.deepLink} />;
    case "success":
      return <SuccessCard deepLink={state.deepLink} />;
    case "error":
      return (
        <ErrorCard
          deepLink={state.deepLink}
          errorDescription={state.errorDescription}
        />
      );
    case "invalid":
      return <InvalidCard />;
  }
}
