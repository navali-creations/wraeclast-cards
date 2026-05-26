import {
  OAuthCallbackProvider,
  PhaseCard,
  useOAuthCallback,
} from "./auth-callback";

export function SoothsayerAuth() {
  const state = useOAuthCallback();

  return (
    <OAuthCallbackProvider value={state}>
      <div className="flex-1 flex items-center justify-center bg-base-content px-5">
        <div className="w-full max-w-sm">
          <PhaseCard />
        </div>
      </div>
    </OAuthCallbackProvider>
  );
}
