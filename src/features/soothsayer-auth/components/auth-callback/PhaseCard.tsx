import { useOAuthCallbackContext } from "../../contexts/OAuthCallbackContext";
import { ErrorCard } from "./ErrorCard";
import { InvalidCard } from "./InvalidCard";
import { LoadingCard } from "./LoadingCard";
import { SuccessCard } from "./SuccessCard";
import { WaitingCard } from "./WaitingCard";

export function PhaseCard() {
  const { phase } = useOAuthCallbackContext();
  switch (phase) {
    case "loading":
      return <LoadingCard />;
    case "waiting":
      return <WaitingCard />;
    case "success":
      return <SuccessCard />;
    case "error":
      return <ErrorCard />;
    case "invalid":
      return <InvalidCard />;
  }
}
