import { useNavigate } from "@tanstack/react-router";
import { useOAuthCallback } from "../hooks/useOAuthCallback";
import { PhaseCard } from "./auth-callback/PhaseCard";

export function SoothsayerAuth() {
  const state = useOAuthCallback();
  const navigate = useNavigate();

  const handleManualOpen = () => {
    if (state.phase === "invalid") return;
    navigate({ href: state.deepLink });
  };

  const handleDownload = () => {
    navigate({ to: "/downloads" });
  };

  return (
    <div className="h-full min-h-full flex items-center justify-center bg-base-content px-5">
      <div className="w-full max-w-sm">
        <PhaseCard
          state={state}
          onManualOpen={handleManualOpen}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
