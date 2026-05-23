import {
  OAuthCallbackProvider,
  PhaseCard,
  useOAuthCallback,
} from "./auth-callback";

export function SoothsayerAuth() {
  const state = useOAuthCallback();

  return (
    <OAuthCallbackProvider value={state}>
      <div className="h-full min-h-full flex items-center justify-center bg-base-content px-5">
        <div className="w-full max-w-sm">
          <PhaseCard />
        </div>
      </div>
    </OAuthCallbackProvider>
  );
}
