export type OAuthCallbackPhase =
  | "loading"
  | "waiting"
  | "success"
  | "error"
  | "invalid";

export type Tone = "default" | "warning" | "error";
export type CardTone = Extract<Tone, "default" | "warning" | "error">;
export type SpinnerTone = Extract<Tone, "default" | "error">;

export interface OAuthCallbackParams {
  code?: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export type OAuthCallbackState =
  | {
      phase: Exclude<OAuthCallbackPhase, "invalid" | "error">;
      deepLink: string;
    }
  | { phase: "error"; deepLink: string; errorDescription?: string }
  | { phase: Extract<OAuthCallbackPhase, "invalid">; deepLink?: never };
